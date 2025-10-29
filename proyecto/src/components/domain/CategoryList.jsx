import React, { useEffect, useState } from "react";
import Services from "../../services/Services";

const CategoryList = ({ onAdd, onEdit }) => {
  const [categorias, setCategorias] = useState([]);

  // 🔹 Cargar todas las categorías al montar el componente
  useEffect(() => {
    Services.getDatos("categorias")
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  // 🔹 Eliminar categoría
  const eliminarCategoria = async (id) => {
    if (window.confirm("¿Deseas eliminar esta categoría?")) {
      await Services.eliminateDatos("categorias", id);
      setCategorias(categorias.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <h2>Lista de Categorías</h2>

      {/* 🟢 Botón de agregar */}
      <button className="add-button" onClick={onAdd}>
        + Agregar Categoría
      </button>

      {/* 🧾 Tabla de categorías */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categorias.length > 0 ? (
            categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(c)}>Editar</button>
                    <button onClick={() => eliminarCategoria(c.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "#888" }}>
                No hay categorías registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
