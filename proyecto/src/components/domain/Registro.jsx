import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Importar navegación
import Services from "../../services/Services";

const Registro = () => {
  const navigate = useNavigate(); // 🚀 Hook de navegación
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    contraseña: "",
    rol: "Cliente", // Siempre Cliente por defecto
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validar contraseña segura
  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  // Cifrado básico (para pruebas locales)
  const cifrarPassword = (password) => {
    return btoa(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!validarPassword(formData.contraseña)) {
      setMensaje(
        "⚠️ La contraseña debe tener mayúsculas, minúsculas, números y un símbolo especial."
      );
      return;
    }

    try {
      // 1️⃣ Obtener usuarios existentes
      const usuarios = await Services.getDatos("usuarios");

      // 2️⃣ Validar que el correo no exista
      const existeCorreo = usuarios.find(
        (u) =>
          u.correo &&
          formData.correo &&
          u.correo.toLowerCase() === formData.correo.toLowerCase());

      if (existeCorreo) {
        setMensaje("⚠️ El correo ya está registrado.");
        return;
      }

      // 3️⃣ Crear un ID autogenerado (sin mostrarlo al usuario)
      const nuevoId =
        usuarios.length > 0
          ? Math.max(...usuarios.map((u) => parseInt(u.id || 0))) + 1
          : 1;

      // 4️⃣ Crear usuario con contraseña cifrada
      const nuevoUsuario = {
        ...formData,
        id: nuevoId,
        contraseña: cifrarPassword(formData.contraseña),
      };

      // Guardar en la tabla de usuarios
      await Services.postDatos("usuarios", nuevoUsuario);

      // 5️⃣ Si el usuario es cliente, guardarlo también en la tabla clientes
      if (nuevoUsuario.rol === "Cliente") {
        const nuevoCliente = {
          id: nuevoId,
          nombre: nuevoUsuario.nombre,
          apellidos: nuevoUsuario.apellidos,
          correo: nuevoUsuario.correo,
          telefono: nuevoUsuario.telefono,
          direccion: nuevoUsuario.direccion,
          cedula: nuevoUsuario.cedula,
          idUsuario: nuevoId,
        };
        await Services.postDatos("clientes", nuevoCliente);
      }

      // ✅ Mensaje y redirección
      setMensaje("✅ Usuario registrado correctamente.");
      setTimeout(() => {
        navigate("/home"); // 🚀 Redirige al Home
      }, 1500);

      // Limpiar formulario
      setFormData({
        cedula: "",
        nombre: "",
        apellidos: "",
        correo: "",
        telefono: "",
        direccion: "",
        contraseña: "",
        rol: "Cliente",
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
          {[
            { label: "Cédula", name: "cedula", type: "text" },
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Apellidos", name: "apellidos", type: "text" },
            { label: "Correo electrónico", name: "correo", type: "email" },
            { label: "Teléfono", name: "telefono", type: "tel" },
            { label: "Dirección", name: "direccion", type: "text" },
            { label: "Contraseña", name: "contraseña", type: "password" },
          ].map((input, i) => (
            <div className="mb-3" key={i}>
              <label>{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn">
            Registrarse
          </button>
        </form>

        {mensaje && (
          <div
            className={`alert ${mensaje.includes("✅")
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
