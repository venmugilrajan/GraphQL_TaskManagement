import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "../graphql/mutations";

function TodoApp() {
  const { data, loading, error } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [userInput, setUserInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) {
      alert("Cannot add empty task.");
      return;
    }
    if (editingId) {
      await updateTask({
        variables: { id: editingId, jobtodo: userInput, toggle: 0 },
        refetchQueries: [{ query: GET_TASKS }]
      });
      setEditingId(null);
    } else {
      await createTask({
        variables: { jobtodo: userInput },
        refetchQueries: [{ query: GET_TASKS }]
      });
    }
    setUserInput("");
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setUserInput(item.jobtodo);
  };

  const toggleTodo = async (item) => {
    await updateTask({
      variables: {
        id: item.id,
        jobtodo: item.jobtodo,
        toggle: item.toggle === 0 ? 1 : 0
      },
      refetchQueries: [{ query: GET_TASKS }]
    });
  };

  const removeTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS }]
      });
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error fetching data. Please try again.</h2>;

  return (
    <div className="main-div">
      <div className="child-div">
        <h1>Task Management System</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={userInput}
            placeholder="Add your task here...."
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>
        {data.getTasks.map((item) => (
          <div className="eachItem" key={item.id}>
            <h3
              onDoubleClick={() => toggleTodo(item)}
              className={item.toggle ? "strike" : ""}
            >
              {item.jobtodo}
            </h3>
            <button onClick={() => editItem(item)}>Edit</button>
            <button onClick={() => removeTask(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;
