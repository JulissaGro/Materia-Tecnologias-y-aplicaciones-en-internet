import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TareaItem from "../components/TareaItem";

function App() {
  const [count, setCount] = useState(0);
  const [tareas, setTareas] = useState([]);
  const [descripcionTarea, setDescripcionTarea] = useState("");

  const obtenerTareas = async () => {
    //A partir de una llamada ajax
    //Este endpoint devuleve un json
    const response = await fetch("http://127.0.0.1:3001/api/v1/tareas");
    //Deserializa el json
    const resDatos = await response.json();
    setTareas(resDatos);
  };

  /* //Guardar una nueva tarea
  const guardarNuevaTarea = async () => {
    //Hacer una petición POST con  los datos que deseamos
    //Como nuestro enpoint recibe un payload json le mandamos eso en el body
    const response = await fetch("http://127.0.0.1:3001/api/v1/tareas", {
      method: "POST",
      body: JSON.stringify({
        descripcion: descripcionTarea,
        fechaRegistro: "2025-02-28T10:25:00",
        fechaCaduca: null,
      }),
      headers: { "Content-Type": "application/json" },
    }); */

  const guardarNuevaTarea = async () => {
    const response = await fetch("http://127.0.0.1:3001/api/v1/tareas", {
      method: "POST",
      body: JSON.stringify({
        descripcion: descripcionTarea,
        fechaRegistro: "2025-02-28T10:25:00",
        fechaCaduca: null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //Regresar una respuesta siempre
    const resData = await response.json();
    alert(`${resData.message} || Id Tarea: ${resData.idTarea}`);
    await obtenerTareas();
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => obtenerTareas()}>
          Consultar Tareas
        </button>
        <input value={descripcionTarea} onChange={(e) => setDescripcionTarea(e.target.value)} />
        <button onClick={
          () => guardarNuevaTarea()}>
          Agregar Nueva Tarea
        </button>

        {tareas.map(tarea => <TareaItem key={tarea.id} tarea={tarea}/>)}

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
