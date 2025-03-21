import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/sign-in">Crea una cuenta</NavLink></li>
        <li><NavLink to="/login">Inicia Sesión</NavLink></li>
      </ul>
    </nav>
  );
}
