import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin.css"

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      <p>Gestiona los productos de Bellas Boutique.</p>

      <div className="admin-buttons">
        <button onClick={() => navigate("/admin/productos")}>Ver Productos</button>
        <button onClick={() => navigate("/admin/nuevo-producto")}>Agregar Producto</button>
        <button onClick={() => navigate("/home")}>Volver al Home</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
