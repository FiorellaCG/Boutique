import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Services from "../../services/Services";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const intento = {
      correo,
      fecha: new Date().toLocaleString(),
      exito: false,
    };

    try {
      const usuarios = await Services.getDatos("usuarios");
      const usuario = usuarios.find(
        (u) => u.correo === correo && u.contraseña === contraseña
      );

      if (usuario) {
        intento.exito = true;
        setMensaje("✅ Inicio de sesión exitoso.");
        await Services.postDatos("intentosLogin", intento);

        // Redirigir a Home después de un pequeño retraso
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMensaje("❌ Credenciales incorrectas.");
        await Services.postDatos("intentosLogin", intento);
      }
    } catch (error) {
      setMensaje("❌ Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <button type="submit" className="btn">Iniciar Sesión</button>
        </form>

        <div className="links">
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          <Link to="/registro">Crear cuenta nueva</Link>
        </div>

        {mensaje && (
          <div
            className={`alert ${
              mensaje.includes("✅")
                ? "alert-success"
                : mensaje.includes("❌")
                ? "alert-error"
                : "alert-info"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

