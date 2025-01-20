import React from "react";
import "../css/SignPage.css";
import rocket from "../assets/rocket.png";
import Button from "../components/Button";

import {
  Link,
  Form,
  useActionData,
  redirect,
  useNavigation,
} from "react-router-dom";

import axios from "axios"; // Import axios to make API calls

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // Check if the form is being submitted
  const actionData = useActionData(); // This will capture any error messages or feedback from the action

  return (
    <div className="signUp">
      <img src={rocket} alt="" />
      <h2>Enter Your Details</h2>
      <Form method="POST">
        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          // required
        />

        <p className="linkBtn">
          <Link className="linkBtn" to={"/forgot-password"}>
            Forgot Password ?
          </Link>
        </p>

        <Button
          content={"Sign in"}
          clickStatus={isSubmitting}
          customClasses={"logBtn"}
        />

        {actionData && <p className="error">{actionData.error}</p>}

        <p>
          Not registered yet?{" "}
          <Link className="linkBtn" to={"/sign-up"}>
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  try {
    // Extract form data from the request
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    // Send login request to backend
    const response = await axios.post("http://localhost:5000/user/signin", {
      email,
      password,
    });

    const userData = response.data.data[0];
    console.log("userData:", userData);

    // Handle successful login
    if (response.data.status === "SUCCESS") {
      window.localStorage.setItem("isLoggedIn", "true");
      window.localStorage.setItem("userId", userData._id);
      return redirect(`/dashboard/${userData._id}`);
    }

    // Handle invalid credentials
    return { error: response.data.message || "Invalid credentials." };
  } catch (error) {
    console.error("Login error:", error);

    // Handle specific error types
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      return {
        error:
          error.response.data?.message ||
          "Server error occurred during login. Please try again.",
      };
    } else if (error.request) {
      // No response from the server
      return { error: "No response from the server. Please try again later." };
    } else {
      // Other errors
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
}

// // Now from here What to be diplayed or Return Code Starts.
//   return (
//     // ***********************Main App's View***********************
//     <div className="App">
//       {/* <hr id="rule" /> */}

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
//             ></input>
//           </div>
//           {/* Description of the task */}
//           <div className="todo-input-item">
//             <label>Description</label>
//             <input
//               type="text"
//               placeholder="What's the description of task ?"
//               value={newDescription}
//               onChange={(e) => setNewDescription(e.target.value)}
//             ></input>
//           </div>
//           {/* Add new stask button */}
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
