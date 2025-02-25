import React, { useState } from "react";

import TaskList from "./TaskList";
import FormTodo from "./FormTodo";

const Container = () => {
  const [list, setList] = useState(() => {
    const storedList = localStorage.getItem("todoList");
    return storedList ? JSON.parse(storedList) : [];
  });
  const handleAddItem = addItem => {
    setList([...list, addItem]);
  };
  return (
    <div>
      <FormTodo handleAddItem={handleAddItem} />
      <TaskList list={list} setList={setList} />
    </div>
  );
};

export default Container;