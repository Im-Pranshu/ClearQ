import React from "react";
import { useLoaderData } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Form } from "react-router-dom";

// Handling all completed tasks.
const CompletedTasks = () => {
  // Load the todo data
  const todos = useLoaderData();

  // Filter out completed tasks
  const completedTasks = todos.filter((todo) => todo.isCompleted);

  return (
    <div>
      {/* Render completed tasks if available */}
      {completedTasks.length > 0 ? (
        completedTasks.map((item) => (
          <div className="todo-list-item" key={item.uniqueId}>
            <div>
              <h3>{item.title}</h3> {/* Display task title */}
              <p>{item.description}</p> {/* Display task description */}
              <p>Completed - {item.completedOn}</p>{" "}
              {/* Display completion date */}
            </div>

            <div className="icons">
              {/* Form to delete the completed task */}
              <Form method="post">
                <input type="hidden" name="todoId" value={item.uniqueId} />
                <input
                  type="hidden"
                  name="actionType"
                  value="deleteCompleted"
                />
                <input type="hidden" name="userId" value={item.userId} />
                <button className="todoBtn" type="submit" title="Delete">
                  <RiDeleteBin6Line className="deleteIcon" />{" "}
                  {/* Delete icon */}
                </button>
              </Form>
            </div>
          </div>
        ))
      ) : (
        // Message when no completed tasks are available
        <p>No completed tasks available</p>
      )}
    </div>
  );
};

export default CompletedTasks;
