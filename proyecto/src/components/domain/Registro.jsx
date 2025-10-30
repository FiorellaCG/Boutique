import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validar contraseña segura
  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  // 🔐 Cifrar contraseña
  const cifrarPassword = (password) => btoa(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // 1️⃣ Validar contraseña
    if (!validarPassword(formData.contraseña)) {
      setMensaje(
        "⚠️ La contraseña debe tener mayúsculas, minúsculas, números y un símbolo especial."
      );
      return;
    }

    try {
      // 2️⃣ Obtener usuarios actuales
      const usuarios = await Services.getDatos("usuarios");

      // 3️⃣ Validar que el correo no exista
      const existeCorreo = usuarios.find(
        (u) =>
          u.correo &&
          formData.correo &&
          u.correo.toLowerCase() === formData.correo.toLowerCase()
      );

      if (existeCorreo) {
        setMensaje("⚠️ El correo ya está registrado.");
        return;
      }

      // 4️⃣ Crear nuevo usuario (rol Cliente por defecto)
      const nuevoUsuario = {
        ...formData,
        rol: "Cliente",
        contraseña: cifrarPassword(formData.contraseña),
      };

      // 5️⃣ Guardar en JSON (usuarios)
      const usuarioGuardado = await Services.postDatos("usuarios", nuevoUsuario);

      // 6️⃣ Crear registro en “clientes”
      const nuevoCliente = {
        nombre: usuarioGuardado.nombre,
        apellidos: usuarioGuardado.apellidos,
        correo: usuarioGuardado.correo,
        telefono: usuarioGuardado.telefono,
        direccion: usuarioGuardado.direccion,
        cedula: usuarioGuardado.cedula,
        idUsuario: usuarioGuardado.id, // id generado por JSON Server
      };

      await Services.postDatos("clientes", nuevoCliente);

      // 7️⃣ Mensaje y redirección al login
      setMensaje("✅ Usuario registrado correctamente.");
      setTimeout(() => {
        navigate("/login"); // redirige al login
      }, 2000);

      // 8️⃣ Limpiar formulario
      setFormData({
        cedula: "",
        nombre: "",
        apellidos: "",
        correo: "",
        telefono: "",
        direccion: "",
        contraseña: "",
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      setMensaje("❌ Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>Cédula</label>
          <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />

          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

          <label>Apellidos</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />

          <label>Correo electrónico</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />

          <label>Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />

          <label>Dirección</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />

          <label>Contraseña</label>
          <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />

          <button type="submit" className="btn">Registrarse</button>
        </form>

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

export default Registro;
