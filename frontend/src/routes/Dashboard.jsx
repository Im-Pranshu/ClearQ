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
  const { userId } = useParams();

  const [editingTodo, setEditingTodo] = useState(null);

  const location = useLocation(); // Get current location

  // Determine the active state based on the URL
  const isCompleteScreen = location.pathname.includes("completed-tasks");

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

          {/* Hidden inputs */}
          <input type="hidden" name="userId" value={userId} />
          <input
            type="hidden"
            name="todoId"
            value={editingTodo ? editingTodo._id : ""}
          />
          <input
            type="hidden"
            name="actionType"
            value={editingTodo ? "update" : "add"}
          />
          <input
            type="hidden"
            name="isCompleted"
            value="false" // Set default to false for new todos
          />

          <div className="todo-input-item">
            <button type="submit" className="primaryBtn">
              {editingTodo ? "Update" : "Add"}
            </button>
          </div>
        </Form>

        <section className="todo-route">
          <div className="btn-area">
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
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

// Action function to handle form submissions
export const action = async ({ request }) => {
  const formData = await request.formData();

  const userId = formData.get("userId"); // Get the userId from the URL params

  console.log("formData:", formData);
  console.log("User ID:", userId);

  const title = formData.get("title");
  // console.log("title:", title);
  const description = formData.get("description");
  // console.log("description:", description);
  const todoId = formData.get("todoId");
  // console.log("todoId:", todoId);
  const actionType = formData.get("actionType"); // Add, Update, Delete
  // console.log("actionType:", actionType);

  if (actionType === "add") {
    try {
      await axios.post("http://localhost:5000/user/create", {
        title,
        description,
        userId,
        isCompleted: false, // Set default to false for new todos
      });
      return redirect(`/dashboard/${userId}/pending-tasks`); // Redirect to the same page to refresh data
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
      return redirect(`/dashboard/${userId}/pending-tasks`); // Redirect to the same page to refresh data
    } catch (error) {
      console.error("Error updating todo:", error);
      return { error: "Failed to update todo." };
    }
  }

  if (actionType === "completed") {
    try {
      await axios.put(`http://localhost:5000/user/update/${todoId}`, {
        isCompleted: true,
      });
      return redirect(`/dashboard/${userId}/completed-tasks`); // Redirect to the same page to refresh data
    } catch (error) {
      console.error("Error updating todo:", error);
      return { error: "Failed to update todo." };
    }
  }

  if (actionType === "delete") {
    try {
      await axios.delete(`http://localhost:5000/user/delete/${todoId}`);

      console.log("Todo ID:", todoId);
      console.log("User ID:", userId);

      return redirect(`/dashboard/${userId}/pending-tasks`); // Redirect to the same page to refresh data
    } catch (error) {
      console.error("Error deleting todo:", error);
      return { error: "Failed to delete todo." };
    }
  }

  if (actionType === "deleteCompleted") {
    try {
      await axios.delete(`http://localhost:5000/user/delete/${todoId}`);

      return redirect(`/dashboard/${userId}/completed-tasks`); // Redirect to the same page to refresh data
    } catch (error) {
      console.error("Error deleting todo:", error);
      return { error: "Failed to delete todo." };
    }
  }
};

export default Dashboard;

// // Now from here What to be diplayed or Return Code Starts.
//   return (
//     // ***********************Main App's View***********************
//     <div className="App">

//       {/* *********************** Whole task mananging UI *********************** */}
//       <div className="todo-wrapper">
//         {/* ***********************Todo List Task Input Section*********************** */}
//         <div className="todo-input">
//           {/* Title of the task */}
//           <div className="todo-input-item">
//             <label>Title</label>
//             <input
//               type="text"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               placeholder="What's the task ?"
//             />
//           </div>
//           {/* Description of the task */}
//           <div className="todo-input-item">
//             <label>Description</label>
//             <input
//               type="text"
//               placeholder="What's the description of task ?"
//               value={newDescription}
//               onChange={(e) => setNewDescription(e.target.value)}
//             />
//           </div>
//           {/* Add new task button */}
//           <div className="todo-input-item">
//             <button
//               type="button"
//               onClick={handleAddTodo}
//               className="primaryBtn"
//             >
//               Add
//             </button>
//           </div>
//           {/* ***********************Todo List Task Input Section*********************** */}
//         </div>

//         {/* ***********************Todo List Buttons*********************** */}
//         <div className="btn-area">
//           {/* now making the color switching enable between todo and complete by switching the classes */}
//           <button
//             className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
//             onClick={() => setISCompleteScreen(false)}
//           >
//             Todo
//           </button>
//           <button
//             className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
//             onClick={() => setISCompleteScreen(true)}
//           >
//             Completed
//           </button>
//           {/* ***********************Todo List Buttons*********************** */}
//         </div>

//         {/* ***********************Todo Task List items*********************** */}
//         <div className="todo-list-area">
//           {/* ******************************All Todo List****************************** */}
//           {/* here we're checking whether user is in the todo screen or not if yes then this block of code will run. */}
//           {isCompleteScreen === false &&
//             allTodos.map((item, index) => {
//               if (currentEdit === index) {
//                 return (
//                   <div className="editWrapper" key={index}>
//                     <input
//                       placeholder="Updated Title"
//                       onChange={(e) => handleUpdateTitle(e.target.value)}
//                       value={currentEditedItem.title}
//                     />
//                     <textarea
//                       placeholder="Updated Description"
//                       onChange={(e) => handleUpdateDescription(e.target.value)}
//                       rows={4}
//                       value={currentEditedItem.description}
//                     />
//                     <button
//                       type="button"
//                       onClick={handleUpdateTodoBtn}
//                       className="primaryBtn"
//                     >
//                       {" "}
//                       Update{" "}
//                     </button>
//                   </div>
//                 );
//               } else {
//                 return (
//                   <div className="todo-list-item" key={index}>
//                     {/* Description about the task */}

//                     <div>
//                       {/* accessing the newTodoItem object's title and description */}
//                       <h3>{item.title}</h3>
//                       <p>{item.description}</p>
//                     </div>

//                     {/* Icons Library - https://react-icons.github.io/react-icons/ */}
//                     <div className="icons">
//                       <RiDeleteBin6Line
//                         className="deleteIcon"
//                         title="Delete"
//                         onClick={() => handleDeleteTodo(index)}
//                       />
//                       <FaRegCheckCircle
//                         className="checkIcon"
//                         title="Complete"
//                         onClick={() => handleComplete(index)}
//                       />
//                       <AiOutlineEdit
//                         className="checkIcon"
//                         title="Edit?"
//                         onClick={() => handleEdit(index, item)}
//                       />
//                     </div>
//                   </div>
//                 );
//               }
//             })}

//           {/* ******************************Completed Todo List****************************** */}
//           {/* here we're checking whether user is in the completed task screen or not if yes then this block of code will run. */}
//           {/* then we'll map the all completed todos which means display all the completed todos. */}
//           {isCompleteScreen === true &&
//             completedTodos.map((item, index) => {
//               return (
//                 <div className="todo-list-item" key={index}>
//                   {/* Description about the task */}

//                   <div>
//                     {/* accessing the newTodoItem object's title and description */}
//                     <h3>{item.title}</h3>
//                     <p>{item.description}</p>
//                     <p>
//                       <small>Completed on :{item.completedOn}</small>
//                     </p>
//                   </div>

//                   {/* Icons Library - https://react-icons.github.io/react-icons/ */}
//                   <div>
//                     <RiDeleteBin6Line
//                       className="deleteIcon"
//                       title="Delete"
//                       onClick={() => handleDeleteCompletedTodo(index)}
//                     />
//                     {/* Removed checkbox symbol because the task is already completed so we don't want to display it anymore.*/}
//                   </div>
//                 </div>
//               );
//             })}

//           {/* ***********************Todo Task List items*********************** */}
//         </div>

//         {/* *********************** Whole task mananging UI *********************** */}
//       </div>
//     </div>
//     // ***********************Main App's View***********************
//   );
// };
