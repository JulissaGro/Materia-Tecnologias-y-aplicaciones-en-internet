import { BrowserRouter, useRoutes } from "react-router-dom";
import "./styles/app.css";

import Home from "./pages/index";
import TicTacToe from "./pages/ticTacToe";
import TicTacToeMaquina from "./pages/ticTacToeMaquina";
import ToDoList from "./pages/toDoList";
import Navbar from "./components/Navbar"

const AppRoutes = () => {
  let routes =useRoutes([
    {path: "/", element: <Home />},
    {path: "/tic-tac-toe", element: <TicTacToe />},
    {path: "/tic-tac-toe-maquina", element: <TicTacToeMaquina />},
    {path: "/to-do-list", element: <ToDoList />}
  ]);

  return routes;
};

function App() {
  return(
    <BrowserRouter>
      <Navbar></Navbar>
      <AppRoutes></AppRoutes>
    </BrowserRouter>
  )
}

export default App;