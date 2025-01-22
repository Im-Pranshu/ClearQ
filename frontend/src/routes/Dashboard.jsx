import React, { useState } from "react";
import {
  useLoaderData,
  useParams,
  Form,
  useNavigate,
  redirect,
  Outlet,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "../css/Dashboard.css";

// Loader function to fetch user-specific todos
export const loader = async ({ params }) => {
  const { userId } = params;
  if (!userId) {
    throw new Response("User ID is missing", { status: 400 });
  }
  try {
    const response = await axios.get(
      `https://clearq-backend.onrender.com/user/${userId}`
    );
    return response.data.data; // Returning todos
  } catch (error) {
    throw new Response("Failed to fetch todos", { status: 500 });
  }
};

const Dashboard = () => {
  const todos = useLoaderData();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get user ID from URL params

  const location = useLocation(); // Get current location

  // Check if the current path is for completed tasks
  const isCompleteScreen = location.pathname.includes("completed-tasks");

  return (
    <div className="App">
      <div className="todo-wrapper">
        <Form
          method="post"
          className="todo-input"
          onSubmit={(e) => {
            // Allow the form to submit, and reset it after submission
            const form = e.target;
            setTimeout(() => form.reset(), 0); // Reset the form after submission
          }}
        >
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="What's the task?"
              autoComplete="off"
              required
            />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="What's the description of the task?"
              autoComplete="off"
              required
            />
          </div>

          {/* Hidden inputs for form data */}
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="actionType" value={"add"} />
          <input
            type="hidden"
            name="isCompleted"
            value="false" // Default to false for new todos
          />

          <div className="todo-input-item">
            <button type="submit" className="primaryBtn">
              {"Add"} {/* Submit button */}
            </button>
          </div>
        </Form>

        <section className="todo-route">
          <div className="btn-area">
            {/* Navigation buttons for switching between tasks */}
            <button
              className={`secondaryBtn ${!isCompleteScreen && "active"}`}
              onClick={() => {
                navigate(`/dashboard/${todos[0].userId}/pending-tasks`);
              }}
            >
              Tasks
            </button>

            <button
              className={`secondaryBtn ${isCompleteScreen && "active"}`}
              onClick={() => {
                navigate(`/dashboard/${todos[0].userId}/completed-tasks`);
              }}
            >
              Completed Tasks
            </button>
          </div>

          <div className="todo-list-area">
            <Outlet /> {/* Render the appropriate child route */}
          </div>
        </section>
      </div>
    </div>
  );
};

// Action function to handle form submissions (add, update, complete, delete todos)
export const action = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId"); // Get user ID from form data

  const title = formData.get("title");
  const description = formData.get("description");
  const todoId = formData.get("todoId");
  const actionType = formData.get("actionType"); // Action type: add, update, complete, delete

  // Handle adding a new todo
  if (actionType === "add") {
    try {
      await axios.post("https://clearq-backend.onrender.com/user/create", {
        title,
        description,
        userId,
        isCompleted: false, // Set default to false for new todos
      });
      return redirect(`/dashboard/${userId}/pending-tasks`); // Refresh the page
    } catch (error) {
      return { error: "Failed to add todo." };
    }
  }

  // Handle updating an existing todo
  if (actionType === "update") {
    try {
      await axios.put(
        `https://clearq-backend.onrender.com/user/update/${todoId}`,
        {
          title,
          description,
        }
      );
      return redirect(`/dashboard/${userId}/pending-tasks`); // Refresh the page
    } catch (error) {
      return { error: "Failed to update todo." };
    }
  }

  // Handle completing a todo
  if (actionType === "completed") {
    try {
      await axios.put(
        `https://clearq-backend.onrender.com/user/update/${todoId}`,
        {
          isCompleted: true,
        }
      );
      return redirect(`/dashboard/${userId}/completed-tasks`); // Refresh the page
    } catch (error) {
      return { error: "Failed to update todo." };
    }
  }

  // Handle deleting a todo
  if (actionType === "delete") {
    try {
      await axios.delete(
        `https://clearq-backend.onrender.com/user/delete/${todoId}`
      );
      return redirect(`/dashboard/${userId}/pending-tasks`); // Refresh the page
    } catch (error) {
      return { error: "Failed to delete todo." };
    }
  }

  // Handle deleting a completed todo
  if (actionType === "deleteCompleted") {
    try {
      await axios.delete(
        `https://clearq-backend.onrender.com/user/delete/${todoId}`
      );
      return redirect(`/dashboard/${userId}/completed-tasks`); // Refresh the page
    } catch (error) {
      return { error: "Failed to delete todo." };
    }
  }
};

export default Dashboard;
