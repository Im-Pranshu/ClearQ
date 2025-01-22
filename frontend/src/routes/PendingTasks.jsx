import React, { useState } from "react";
import { useLoaderData, Form, useSubmit } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";

const PendingTasks = () => {
  // Load todos data using Remix's useLoaderData
  const todos = useLoaderData();

  // Filter out tasks that are not completed
  const pendingTasks = todos.filter((todo) => !todo.isCompleted);

  // Remix submit hook for handling form submissions
  const submit = useSubmit();

  // State to manage the todo being edited
  const [editingTodo, setEditingTodo] = useState(null);

  // States for updated title and description while editing
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Set the selected todo for editing and populate the form fields
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setUpdatedTitle(todo.title);
    setUpdatedDescription(todo.description);
  };

  // Handle submitting the updated todo
  const handleUpdateTodo = () => {
    // Create FormData object to send the updated todo details
    const formData = new FormData();
    formData.append("todoId", editingTodo.uniqueId);
    formData.append("actionType", "update");
    formData.append("title", updatedTitle);
    formData.append("description", updatedDescription);
    formData.append("userId", editingTodo.userId);

    // Submit the form data using Remix's submit method
    submit(formData, { method: "post" });
    setEditingTodo(null); // Close the edit view after submission
  };

  return (
    <div>
      {/* Check if there are any pending tasks */}
      {pendingTasks.length > 0 ? (
        pendingTasks.map((item) => (
          <div key={item.uniqueId}>
            {/* Display editing form if the current todo is being edited */}
            {editingTodo && editingTodo.uniqueId === item.uniqueId ? (
              <div className="editWrapper">
                {/* Input for updated title */}
                <input
                  className="todo-input-item"
                  placeholder="Updated Title"
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  value={updatedTitle}
                />
                {/* Textarea for updated description */}
                <textarea
                  className="todo-input-item"
                  placeholder="Updated Description"
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  rows={4}
                  value={updatedDescription}
                />
                {/* Update button */}
                <button
                  type="button"
                  onClick={handleUpdateTodo}
                  className="primaryBtn"
                >
                  Update
                </button>
                {/* Cancel button to exit editing mode */}
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="secondaryBtn"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Display todo details if not editing
              <div className="todo-list-item">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="icons">
                  {/* Delete button with form submission */}
                  <Form method="post">
                    <input type="hidden" name="todoId" value={item.uniqueId} />
                    <input type="hidden" name="actionType" value="delete" />
                    <input type="hidden" name="userId" value={item.userId} />
                    <button className="todoBtn" type="submit" title="delete">
                      <RiDeleteBin6Line className="deleteIcon" />
                    </button>
                  </Form>

                  {/* Complete button with form submission */}
                  <Form method="post">
                    <input type="hidden" name="todoId" value={item.uniqueId} />
                    <input type="hidden" name="actionType" value="completed" />
                    <input type="hidden" name="userId" value={item.userId} />
                    <button className="todoBtn" type="submit" title="completed">
                      <FaRegCheckCircle className="checkIcon" />
                    </button>
                  </Form>

                  {/* Edit button to switch to edit mode */}
                  <button
                    className="todoBtn"
                    type="button"
                    title="Edit"
                    onClick={() => handleEditClick(item)}
                  >
                    <AiOutlineEdit className="checkIcon" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        // Message when no pending tasks are available
        <p>No pending tasks available</p>
      )}
    </div>
  );
};

export default PendingTasks;
