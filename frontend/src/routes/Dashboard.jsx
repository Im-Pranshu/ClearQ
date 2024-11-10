import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";

const App = () => {
  // here this state will help in switching between the completed and todo screen - False means TodoScreen and True means we're on the complete page.
  const [isCompleteScreen, setISCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);

  // Handling add todo click
  const handleAddTodo = () => {
    // object to store new todo item.
    let newTodoItem = {
      title: newTitle, // storing newTitle in title.
      description: newDescription,
    };
    // making copy of previous state array in which all todo list will be there.
    let updatedTodoArray = [...allTodos];
    // updating the state array.
    updatedTodoArray.push(newTodoItem);
    // setting todoArray to updated array.
    setTodos(updatedTodoArray);
    // storing the update todo list in the local storage so that it can be accessed later even after refresh.
    // setItem is used to set the item.
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArray)); // here values inside() are 1st - Keyvalue to access ,2nd - store the value but here the value will not be usable directly so to store an object or array ,we'll stringify it using global object JSON.stringify(nameOfArrayorObject)
  };

  // Adding delete functionality of todos
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    // syntax of splice(position, no of values);
    // At position index, remove 1 item:
    reducedTodo.splice(index, 1); // splice removes the item at the specific index.

    // Also remove it from local storage also.
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));

    // update the array of todos after delete.
    setTodos(reducedTodo);
  };

  // Moving the completed tasks to the completed section.
  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1; // because it is from 0 to 11 to make it 1 to 12 we'll add 1.
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    // This will contain the time and date of completed task.
    let completedOn =
      dd + "/" + mm + "/" + yyyy + " at " + h + ": " + m + ":" + s;

    // filtering the items which are completed on clicking complete symbol, items at that index will be stored below with time of completion.
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    // storing all completed elements in temp array.
    let updatedCompletedArray = [...completedTodos];
    // after that pushing filtered item in that array.
    updatedCompletedArray.push(filteredItem);
    // after successfully completing.
    setCompletedTodos(updatedCompletedArray);
    handleDeleteTodo(index); // this will delete the same completed item at same index from the actual todo list as click is encounter on the checkbox.
    localStorage.setItem(
      "completedTodoList",
      JSON.stringify(updatedCompletedArray)
    ); // storing completed Todo list locally
  };

  // This function will delete the completed todo when delete button is clicked -> This fn is similar to handleDeleteTodo fn difference is that it's deleting the completed tasks only.
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos]; // storing completed todos.
    reducedTodo.splice(index, 1); // delete the value at which index delete button is pressed.
    localStorage.setItem("completedTodoList", JSON.stringify(reducedTodo)); // locally update the completedTodos after the deletion.
    setCompletedTodos(reducedTodo); // updated completed todos.
  };

  // ************JS Code for Edit Task Functionality**************
  const [currentEdit, setCurrentEdit] = useState(""); // this state will store the index of the item to be edited.
  const [currentEditedItem, setCurrentEditedItem] = useState(""); // this state will store the item after editing it.

  // Dealing with edit button
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind); // storing the index of item to be edited.
    setCurrentEditedItem(item); // storing the item to be edited.
  };

  // Updating the title when edit is clicked
  const handleUpdateTitle = (value) => {
    // Updating the title of the task
    setCurrentEditedItem((prev) => {
      // here ...prev will fetch the previous value.
      // title will be set to the current value.
      return { ...prev, title: value };
    });
  };

  // Updating the decription when edit is clicked
  const handleUpdateDescription = (value) => {
    // Updating the description of the task.
    setCurrentEditedItem((prev) => {
      // here ...prev will fetch the previous value.
      // description will be set to the current decription.
      return { ...prev, description: value };
    });
  };

  const handleUpdateTodoBtn = () => {
    let editedTodoList = [...allTodos]; // grabbing the whole list which is previous list before editing.
    // Here currentEdit is the index which we're updating right now so we'll access that location in the editedTodoList and updating it with currentEditedItem which the element which is fetched by the user input.
    editedTodoList[currentEdit] = currentEditedItem;

    // Now updating the list after making the changes.
    setTodos(editedTodoList);

    // After updating removing the currentEdit index
    setCurrentEdit("");

    // Store the list in local database so that it don't get lost after refresh.
    localStorage.setItem("todolist", JSON.stringify(editedTodoList));
  };

  // ***********Edit Task JS code Ends up here***********

  // But here we've stored data locally only but can't use this so to use it.
  // we'll use useEffect - Whenever the page will be rendered it will check that whether there is any locally stored data available or not ?
  useEffect(() => {
    // whenever page will rerender it will check below code
    let savedTodo = JSON.parse(localStorage.getItem("todolist")); // here JSON.parse will convert the data back to array from string.
    let savedCompletedTodo = JSON.parse(
      localStorage.getItem("completedTodoList")
    );
    // if there are some todos then set it to todolist if empty then dont do anything.
    if (savedTodo) setTodos(savedTodo);

    // fetching the stored completed todo list from local storage.
    if (savedCompletedTodo) setCompletedTodos(savedCompletedTodo);
  }, []);

  // Now from here What to be diplayed or Return Code Starts.
  return (
    // ***********************Main App's View***********************
    <div className="App">
      {/* <hr id="rule" /> */}

      {/* *********************** Whole task mananging UI *********************** */}
      <div className="todo-wrapper">
        {/* ***********************Todo List Task Input Section*********************** */}
        <div className="todo-input">
          {/* Title of the task */}
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task ?"
            ></input>
          </div>
          {/* Description of the task */}
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              placeholder="What's the description of task ?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></input>
          </div>
          {/* Add new stask button */}
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
          {/* ***********************Todo List Task Input Section*********************** */}
        </div>

        {/* ***********************Todo List Buttons*********************** */}
        <div className="btn-area">
          {/* now making the color switching enable between todo and complete by switching the classes */}
          <button
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setISCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setISCompleteScreen(true)}
          >
            Completed
          </button>
          {/* ***********************Todo List Buttons*********************** */}
        </div>

        {/* ***********************Todo Task List items*********************** */}
        <div className="todo-list-area">
          {/* ******************************All Todo List****************************** */}
          {/* here we're checking whether user is in the todo screen or not if yes then this block of code will run. */}
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="editWrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Description"
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      rows={4}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateTodoBtn}
                      className="primaryBtn"
                    >
                      {" "}
                      Update{" "}
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    {/* Description about the task */}

                    <div>
                      {/* accessing the newTodoItem object's title and description */}
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    {/* Icons Library - https://react-icons.github.io/react-icons/ */}
                    <div className="icons">
                      <RiDeleteBin6Line
                        className="deleteIcon"
                        title="Delete"
                        onClick={() => handleDeleteTodo(index)}
                      />
                      <FaRegCheckCircle
                        className="checkIcon"
                        title="Complete"
                        onClick={() => handleComplete(index)}
                      />
                      <AiOutlineEdit
                        className="checkIcon"
                        title="Edit?"
                        onClick={() => handleEdit(index, item)}
                      />
                    </div>
                  </div>
                );
              }
            })}

          {/* ******************************Completed Todo List****************************** */}
          {/* here we're checking whether user is in the completed task screen or not if yes then this block of code will run. */}
          {/* then we'll map the all completed todos which means display all the completed todos. */}
          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  {/* Description about the task */}

                  <div>
                    {/* accessing the newTodoItem object's title and description */}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Completed on :{item.completedOn}</small>
                    </p>
                  </div>

                  {/* Icons Library - https://react-icons.github.io/react-icons/ */}
                  <div>
                    <RiDeleteBin6Line
                      className="deleteIcon"
                      title="Delete"
                      onClick={() => handleDeleteCompletedTodo(index)}
                    />
                    {/* Removed checkbox symbol because the task is already completed so we don't want to display it anymore.*/}
                  </div>
                </div>
              );
            })}

          {/* ***********************Todo Task List items*********************** */}
        </div>

        {/* *********************** Whole task mananging UI *********************** */}
      </div>
    </div>
    // ***********************Main App's View***********************
  );
};

export default App;
