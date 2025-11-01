import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Services from "../../services/Services";

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Generar nueva contraseña aleatoria
  const generarPassword = () => {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from({ length: 10 }, () =>
      caracteres[Math.floor(Math.random() * caracteres.length)]
    ).join("");
  };

  const cifrarPassword = (password) => btoa(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const usuarios = await Services.getDatos("usuarios");
      const usuario = usuarios.find((u) => u.correo === correo);

      if (!usuario) {
        setMensaje("No existe una cuenta registrada con ese correo.");
        return;
      }

      // Generar y cifrar nueva contraseña
      const nuevaClave = generarPassword();
      const nuevaClaveCifrada = cifrarPassword(nuevaClave);

      // Actualizar el usuario en el JSON
      const usuarioActualizado = { ...usuario, contraseña: nuevaClaveCifrada };
      await Services.putDatos("usuarios", usuario.id, usuarioActualizado);

      // Mostrar mensaje
      setMensaje(`Nueva contraseña generada: ${nuevaClave}`);

      // Esperar 3 segundos y volver al login
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      setMensaje("Error al recuperar contraseña: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            Recuperar
          </button>
        </form>

        <div className="links">
          <Link to="/">Volver al inicio de sesión</Link>
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

export default RecuperarPassword;
