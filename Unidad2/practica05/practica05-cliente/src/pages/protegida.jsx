import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/protegida.css";

export default function protegida() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("refresh_token");
    setUserData(null);
    navigate("/login");
  };

  const refreshrefreshToken = async () => {
    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
    if (!refreshToken) return null;

    try {
      const response = await fetch(
        "http://localhost/practica05-api/refresh_token.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(
          "refresh_token",
          JSON.stringify(data.refresh_token)
        );
        return data.refresh_token;
      } else {
        //logout();
        console.log("Refresh_token falla");
        return null;
      }
    } catch (error) {
      console.error("Error al renovar token:", error);
      //logout();
      console.log("Literal error en el try catch: " + error.message);
      return null;
    }
  };

  const fetchUserData = async () => {
    let refreshToken = JSON.parse(localStorage.getItem("refresh_token"));

    if (!refreshToken) {
      refreshToken = await refreshrefreshToken();
      if (!refreshToken) return;
    }

    try {
      const response = await fetch(
        "http://localhost/practica05-api/get_usuario.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const user = await response.json();

      if (!response.ok) {
        console.log(response.message);

        const newRefreshToken = await refreshrefreshToken();
        if (!newRefreshToken) {
          //logout();
          return;
        }

        const retryResponse = await fetch(
          "http://localhost/practica05-api/get_usuario.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        if (retryResponse.ok) {
          const user = await retryResponse.json();
          setUserData(user);
        } else {
          console.log(retryResponse.message);

          //logout();
        }
      } else if (response.ok) {
        setUserData(user);
      } else {
        console.log("No se pudo settear");

        //logout();
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      //logout();
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, []);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="user-profile-card">
      <h1>Perfil de Usuario</h1>
      <div className="user-details">
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Nombre:</strong> {userData.nombre}
        </p>
        <p>
          <strong>Apellidos:</strong> {userData.apellidos}
        </p>
        <p>
          <strong>Tipo de Usuario:</strong> {userData.tipo_usuario}
        </p>
      </div>
      <button className="logout-button" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
