import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import ProgressBar from "@ramonak/react-progress-bar";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function TodoList() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isEditing, setIsEditing] = useState({ editing: false, item: null });
  const [showSingle, setShowSingle] = useState({ show: false, item: null });

  //
  // Get data from
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const list = localStorage.getItem("todoList");

    if (!list) {
      return;
    }

    setTodoList(JSON.parse(list));
  }

  //
  // Persist state
  function persistState(list) {
    localStorage.clear();

    localStorage.setItem("todoList", list);

    getData();
  }

  //
  // Add/Update new task
  function addTask(e) {
    e.preventDefault();

    if (isEditing.editing) {
      const newState = todoList.map((obj) => {
        // if id equals clicked task, update task property
        if (obj.id === isEditing?.item?.id) {
          return { ...obj, task: todo };
        }

        // otherwise return object as is
        return obj;
      });

      setTodo("");
      setModalVisible(false);
      setIsEditing({ editing: false, item: null });

      // Persist the tasks
      persistState(JSON.stringify(newState));
    } else {
      if (todo.trim() === "") {
        return alert("Enter a new task");
      }

      // const lastItem = todoList[0];
      const lastItem = todoList.slice(-1)[0];

      let id;
      // If list is empty, set the id to 1 else the last id and increment it by 1
      if (!lastItem) {
        id = 1;
      } else {
        id = lastItem.id + 1;
      }

      setTodo("");
      setModalVisible(false);

      // Persist the tasks
      persistState(
        JSON.stringify([
          ...todoList,
          { id, task: todo, completed: false, created_at: new Date() },
        ])
      );
    }
  }

  //
  // Check or uncheck task
  function setChecked(item, isChecked) {
    // console.log(item);
    const newState = todoList.map((obj) => {
      // if id equals clicked task, update completed property
      if (obj.id === item.id) {
        return { ...obj, completed: isChecked };
      }

      // otherwise return object as is
      return obj;
    });

    // Persist the tasks
    persistState(JSON.stringify(newState));
  }

  //
  // Toggle edit task
  function toggleEditTask(item) {
    setIsEditing({ editing: true, item });
    setModalVisible(true);
    setTodo(item.task);
  }

  //
  // Remove task from todo list
  function deleteTask(item) {
    const newState = todoList.filter((obj) => obj.id !== item.id);

    persistState(JSON.stringify(newState));
  }

  const done = todoList.filter((t) => t.completed !== false);
  let progress = 0;
  if (todoList.length > 0) {
    progress = (done.length / todoList.length) * 100;
  }

  //
  //
  return (
    <div className="">
      <div className="container">
        <div className="row">
          <div className="col-3"></div>

          <div className="col-6">
            <h4 className="text-center my-4">Todo App</h4>

            <section className="">
              <form className="row g-3">
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword2"
                    placeholder="Create new task"
                    value={todo}
                    onChange={(e) => {
                      setTodo(e.target.value);
                    }}
                  />
                </div>

                <div className="col-3">
                  <button
                    onClick={addTask}
                    type="submit"
                    className="btn btn-primary mb-3 px-4"
                    style={{
                      backgroundColor: "#c026d3",
                      borderColor: "#c026d3",
                    }}
                  >
                    {isEditing.editing ? "UPDATE" : "ADD"}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <ProgressBar
                  completed={progress}
                  height="7px"
                  labelSize="9px"
                  bgColor="#c026d3"
                />
              </div>

              <div style={{ maxHeight: 400, overflow: "scroll" }}>
                {todoList.map((t) => (
                  <div key={t.id} className="d-flex">
                    <input
                      className=""
                      type="checkbox"
                      checked={Boolean(t.completed)}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setChecked(t, e.target.checked);
                      }}
                    />

                    <p
                      className="col-8 pt-3"
                      style={{
                        marginLeft: 5,
                        textDecoration: Boolean(t.completed)
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {t.task}
                    </p>

                    <span style={{ marginRight: 10, cursor: "pointer" }}>
                      <svg
                        onClick={() => {
                          toggleEditTask(t);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </span>

                    <span style={{ marginRight: 10, cursor: "pointer" }}>
                      <svg
                        onClick={() => {
                          deleteTask(t);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-3"></div>
        </div>
      </div>
    </div>
  );
}
