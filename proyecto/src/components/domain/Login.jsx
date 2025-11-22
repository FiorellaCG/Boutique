import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Services from "../../services/Services";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const cifrarPassword = (password) => btoa(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const intento = {
      correo,
      fecha: new Date().toLocaleString(),
      exito: false,
    };

    try {
      // Obtener todos los usuarios
      const usuarios = await Services.getDatos("usuarios");

      // Buscar usuario con correo y contraseña (ambas cifradas)
      const usuario = usuarios.find(
        (u) =>
          u.correo === correo &&
          u.contraseña === cifrarPassword(contraseña)
      );

      if (usuario) {
        intento.exito = true;
        setMensaje("Inicio de sesión exitoso.");

        // Guardar intento de login
        await Services.postDatos("intentosLogin", intento);

        // Guardar sesión local (opcional)
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

        // Redirigir según el rol
        setTimeout(() => {
          if (usuario.rol === "Administrador" || usuario.rol === "Vendedor" || usuario.rol === "Colaborador") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 1500);
      } else {
        setMensaje("Credenciales incorrectas.");
        await Services.postDatos("intentosLogin", intento);
      }
    } catch (error) {
      setMensaje("Error al iniciar sesión: " + error.message);
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

          <button type="submit" className="btn">
            Iniciar Sesión
          </button>
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
