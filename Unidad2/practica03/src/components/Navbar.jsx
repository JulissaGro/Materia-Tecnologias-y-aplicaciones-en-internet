import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/tic-tac-toe">Tic-tac-toe</NavLink></li>
        <li><NavLink to="/tic-tac-toe-maquina">Tic-tac-toe máquina</NavLink></li>
        <li><NavLink to="/to-do-list">To-Do list</NavLink></li>
      </ul>
    </nav>
  );
}
