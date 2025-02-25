import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import InputEcho from "../components/inputEcho.jsx";
import ItemComponent from "../components/itemComponent.jsx";

function obtenerDatos() {
  const d = [
    { id: 1, nombre: "Item 1", descripcion: "Descripción del item 1" },
    { id: 2, nombre: "Item 2", descripcion: "Descripción del item 2" },
    { id: 3, nombre: "Item 3", descripcion: "Descripción del item 3" },
    { id: 4, nombre: "Item 4", descripcion: "Descripción del item 4" },
    { id: 5, nombre: "Item 5", descripcion: "Descripción del item 5" },
  ];
  return d;
}

function Home() {
  const [count, setCount] = useState(0);
  const [textoInput, setTextoInput] = useState("");
  const [datos, setDatos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const btnClick = async () => {
    //función asíncrona
    setCargandoDatos(true); //true la carga de datos
    setDatos([]); //Vaciar datos
    const d = await obtenerDatos();
    setDatos(d);
    setCargandoDatos(false); //False ya no se están cargando datos
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

      <button onClick={() => btnClick()}>Cargar Datos</button>
      <div>
        <strong>{cargandoDatos ? "Cargando datos..." : "Datos cargados 🎆"}</strong>
        {/* Una forma de iterar, de una colección se itera con map para 
                  regresar un array de componentes, en este caso. Esto es lo que
                  react renderizaría */}
        {datos.map((i) => (
          <ItemComponent key={i.id}/>
        ))}
      </div>

      <InputEcho titulo="Input de Prueba" textoActualizado={(nuevoTexto) => setTextoInput(nuevoTexto)}/>
      <p>Input Echo tiene el texto: <strong>{textoInput}</strong></p>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
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

export default Home;
