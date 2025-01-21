import React, { useState } from "react";
import { useLoaderData, Form, useSubmit } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";

const PendingTasks = () => {
  const todos = useLoaderData();
  const pendingTasks = todos.filter((todo) => !todo.isCompleted); // Assuming completedOn is null or undefined for pending tasks
  const submit = useSubmit();
  const [editingTodo, setEditingTodo] = useState(null);
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    submit();
  };

  return (
    <div>
      {pendingTasks.length > 0 ? (
        pendingTasks.map((item) => (
          <div className="todo-list-item" key={item.uniqueId}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <div className="icons">
              <Form method="post">
                <input type="hidden" name="todoId" value={item.uniqueId} />
                <input type="hidden" name="actionType" value="delete" />
                <input type="hidden" name="userId" value={item.userId} />
                {/* delete task */}
                <button
                  className="todoBtn"
                  type="submit"
                  title="delete"
                  onClick={() => {
                    submit();
                  }} // Trigger form submission
                >
                  <RiDeleteBin6Line className="deleteIcon" />
                </button>
              </Form>

              <Form method="post">
                <input type="hidden" name="todoId" value={item.uniqueId} />
                <input type="hidden" name="actionType" value="completed" />
                <input type="hidden" name="userId" value={item.userId} />
                {/* mark task as completed */}
                <button
                  className="todoBtn"
                  type="submit"
                  title="completed"
                  onClick={() => {
                    submit();
                  }}
                >
                  <FaRegCheckCircle className="checkIcon" />
                </button>
              </Form>

              <Form method="post">
                <input type="hidden" name="todoId" value={item.uniqueId} />
                <input type="hidden" name="actionType" value="update" />
                <input type="hidden" name="userId" value={item.userId} />
                {/* mark task as completed */}
                <button
                  className="todoBtn"
                  type="submit"
                  title="Edit"
                  onClick={() => {
                    handleEdit(item);
                  }}
                >
                  <AiOutlineEdit className="checkIcon" />
                </button>
              </Form>
            </div>
          </div>
        ))
      ) : (
        <p>No pending tasks available</p>
      )}
    </div>
  );
};

export default PendingTasks;
