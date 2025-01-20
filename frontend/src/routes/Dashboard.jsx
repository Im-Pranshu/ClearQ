import React, { useState } from "react";
import {
  useLoaderData,
  useParams,
  Form,
  useNavigate,
  redirect,
  useActionData,
} from "react-router-dom";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import "../css/Dashboard.css";

// Loader function to fetch data
export const loader = async ({ params }) => {
  const { userId } = params;
  if (!userId) {
    throw new Response("User ID is missing", { status: 400 });
  }
  try {
    const response = await axios.get(`http://localhost:5000/user/${userId}`);
    return response.data.data; // Returning todos
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Response("Failed to fetch todos", { status: 500 });
  }
};

const Dashboard = () => {
  const todos = useLoaderData();
  const navigate = useNavigate();
  const actionData = useActionData();
  const { userId } = useParams();
  console.log("userId:", userId);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  return (
    <div className="App">
      <div className="todo-wrapper">
        <Form method="post" className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingTodo ? editingTodo.title : ""}
              placeholder="What's the task?"
              required
            />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              name="description"
              defaultValue={editingTodo ? editingTodo.description : ""}
              placeholder="What's the description of the task?"
              required
            />
          </div>

          <input type="hidden" name="userId" value={userId} />

          <input
            type="hidden"
            name="todoId"
            value={editingTodo ? editingTodo.uniqueId : ""}
          />

          <input
            type="hidden"
            name="actionType"
            value={editingTodo ? "update" : "add"}
          />

          <div className="todo-input-item">
            <button type="submit" className="primaryBtn">
              {editingTodo ? "Update" : "Add"}
            </button>
          </div>
        </Form>

        <div className="btn-area">
          <button
            className="secondaryBtn active"
            onClick={() => navigate(`/dashboard/${todos[0].userId}`)}
          >
            Todo
          </button>
          <button
            className="secondaryBtn"
            onClick={() => navigate(`/dashboard/${todos[0].userId}`)}
          >
            Completed Task
          </button>
        </div>

        <div className="todo-list-area">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map((item) => (
              <div className="todo-list-item" key={item._id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>{item.completedOn}</p>
                </div>

                <div className="icons">
                  <Form method="post">
                    <input type="hidden" name="todoId" value={item._id} />
                    <input type="hidden" name="actionType" value="delete" />
                    <RiDeleteBin6Line
                      className="deleteIcon"
                      title="Delete"
                      onClick={() => submit()} // Trigger form submission
                    />
                  </Form>

                  <FaRegCheckCircle
                    className="checkIcon"
                    title="Complete"
                    onClick={() => console.log("Complete clicked")}
                  />
                  <AiOutlineEdit
                    className="checkIcon"
                    title="Edit"
                    onClick={() => handleEdit(item)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No tasks available</p> // Fallback message if todos are empty
          )}
        </div>
      </div>
    </div>
  );
};

// Action function to handle form submissions
export const action = async ({ request }) => {
  const formData = await request.formData();

  const userId = formData.get("userId"); // Get the userId from the URL params

  console.log("formData:", formData);
  console.log("userId:", userId);

  const title = formData.get("title");
  console.log("title:", title);
  const description = formData.get("description");
  console.log("description:", description);
  const todoId = formData.get("todoId");
  console.log("todoId:", todoId);
  const actionType = formData.get("actionType"); // Add, Update, Delete
  console.log("actionType:", actionType);

  if (actionType === "add") {
    try {
      await axios.post("http://localhost:5000/user/create", {
        title,
        description,
        userId,
      });
      return redirect(`/dashboard/${userId}`); // Redirect to the same page to refresh data
    } catch (error) {
      console.error("Error adding todo:", error);
      return { error: "Failed to add todo." };
    }
  }

  if (actionType === "update") {
    try {
      await axios.put(`http://localhost:5000/user/update/${todoId}`, {
        title,
        description,
      });
      return redirect(`/todos/${userId}`);
    } catch (error) {
      console.error("Error updating todo:", error);
      return { error: "Failed to update todo." };
    }
  }

  if (actionType === "delete") {
    try {
      await axios.delete(`http://localhost:5000/user/delete/${todoId}`);
      return redirect(`/todos/${userId}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      return { error: "Failed to delete todo." };
    }
  }
};

export default Dashboard;
