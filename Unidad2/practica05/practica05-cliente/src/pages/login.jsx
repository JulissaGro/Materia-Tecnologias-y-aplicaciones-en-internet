import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
    if (refreshToken) {
      alert("Hay una sesión iniciada, redirigiendo a página protegida");
      navigate("/protegida");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/practica05-api/login_usuario.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "refresh_token",
          JSON.stringify(data.refresh_token)
        );
        localStorage.setItem(
          "access_token",
          JSON.stringify(data.access_token)
        );
        alert("Inicio de sesión exitoso");
        navigate("/protegida");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      <p>Bienvenido al Login</p>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
