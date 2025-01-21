import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { Form } from "react-router-dom";

const CompletedTasks = () => {
  const todos = useLoaderData();
  const completedTasks = todos.filter((todo) => todo.isCompleted); // Assuming completedOn is defined for completed tasks

  return (
    <div>
      {completedTasks.length > 0 ? (
        completedTasks.map((item) => (
          <div className="todo-list-item" key={item.uniqueId}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Completed - {item.completedOn}</p>
            </div>

            <div className="icons">
              <Form method="post">
                <input type="hidden" name="todoId" value={item.uniqueId} />
                <input
                  type="hidden"
                  name="actionType"
                  value="deleteCompleted"
                />
                <input type="hidden" name="userId" value={item.userId} />
                <button
                  className="todoBtn"
                  type="submit"
                  title="Delete"
                  onClick={() => {
                    console.log("Delete clicked");
                    submit();
                  }} // Trigger form submission
                >
                  <RiDeleteBin6Line className="deleteIcon" />
                </button>
              </Form>
            </div>
          </div>
        ))
      ) : (
        <p>No completed tasks available</p>
      )}
    </div>
  );
};

export default CompletedTasks;
