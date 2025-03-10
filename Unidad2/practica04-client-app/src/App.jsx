import { use, useState } from "react";
import "./App.css";
import TareaItem from "../components/TareaItem";

function App() {
  const [tareas, setTareas] = useState([]);
  const [descripcionTarea, setDescripcionTarea] = useState("");
  const [usernameUser, setUsername] = useState("");
  const [nombreUser, setNombre] = useState("");
  const [apellidosUser, setApellidos] = useState("");
  const [passwordUser, setPassword] = useState("");
  const [passwordVerifUser, setPasswordVerif] = useState("");

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

  const registrarNuevoUsuario = async (e) => {
    e.preventDefault();
    alert("Enviando datos");

    const response = await fetch("http://localhost:3001/api/v1/account", {
      method: "POST",
      body: JSON.stringify({
        username: usernameUser,
        nombre: nombreUser,
        apellidos: apellidosUser,
        password: passwordUser,
        passwordVerif: passwordVerifUser,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();
    alert(`${resData.message}` || `Id Usuario: ${resData.idUsuario}`);
  };

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
    alert(`Id Tarea: ${resData.idTarea}`);
    await obtenerTareas();
  };

  return (
    <>
      <h1>Gestor de tareas</h1>
      <div className="card">
        <button onClick={() => obtenerTareas()}>Consultar Tareas</button>
        <input
          value={descripcionTarea}
          onChange={(e) => setDescripcionTarea(e.target.value)}
        />
        <button onClick={() => guardarNuevaTarea()}>Agregar Nueva Tarea</button>

        {tareas.map((tarea) => (
          <TareaItem key={tarea.id} tarea={tarea} />
        ))}
      </div>
      <div className="card-form">
        <form className="formulario" onSubmit={registrarNuevoUsuario}>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>Username: </label>
                </td>
                <td>
                  <input
                    required
                    value={usernameUser}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Nombre: </label>
                </td>
                <td>
                  <input
                    required
                    value={nombreUser}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Apellidos</label>
                </td>
                <td>
                  <input
                    value={apellidosUser}
                    onChange={(e) => setApellidos(e.target.value)}
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Contraseña: </label>
                </td>
                <td>
                  <input
                    required
                    value={passwordUser}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Confirmar contraseña: </label>
                </td>
                <td>
                  <input
                    required
                    value={passwordVerifUser}
                    onChange={(e) => setPasswordVerif(e.target.value)}
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <button type="submit">Registrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
}

export default App;
