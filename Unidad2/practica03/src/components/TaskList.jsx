import React from "react";
import Checkbox from "./Checkbox";

const TaskList = props => {
  const { list, setList } = props;

  const onChangeStatus = e => {
    const { name, checked } = e.target;
    const updateList = list.map(item => ({
      ...item,
      done: item.id === name ? checked : item.done
    }));
    setList(updateList);
    localStorage.setItem("todoList", JSON.stringify(list));
  };

  const onClickRemoveItem = e => {
    const updateList = list.filter(item => !item.done);
    setList(updateList);
    localStorage.setItem("todoList", JSON.stringify(updateList));
  };

  localStorage.setItem("todoList", JSON.stringify(list));
  const chk = list.map(item => (
    <Checkbox key={item.id} data={item} onChange={onChangeStatus} />
  ));
  return (
    <div className="todo-list">
      {list.length ? chk : "No tasks"}
      {list.length ? (
        <p>
          <button className="button blue" onClick={onClickRemoveItem}>
            Borrar tareas realizadas
          </button>
        </p>
      ) : null}
    </div>
  );
};

export default TaskList;