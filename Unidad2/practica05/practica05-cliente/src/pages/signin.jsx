import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signin.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.username.trim())
      newErrors.username = "El username es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirma tu contraseña";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {  
      try {
        const response = await fetch('http://localhost/practica05-api/nuevo_usuario.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Registro exitoso");
          navigate("/");
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("Hubo un error al conectar con el servidor.");
      }
    }
  };
  

  return (
    <>
      <br/>
      <br/>
      <div className="card">
        <h1>Sign In</h1>
        <p>Bienvenido, crea una cuenta.</p>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </>
  );
}
