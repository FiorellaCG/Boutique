import React, { useState, useEffect } from "react";
import Services from "../../services/Services";

const CategoryForm = ({ categoriaEdit, onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: ""
  });

  useEffect(() => {
    if (categoriaEdit) setForm(categoriaEdit);
  }, [categoriaEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (categoriaEdit) {
        await Services.putDatos("categorias", categoriaEdit.id, form);
      } else {
        await Services.postDatos("categorias", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar categoría", error);
    }
  };

  return (
    <div className="admin-section">
      <h2>{categoriaEdit ? "Editar Categoría" : "Nueva Categoría"}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />


        <div className="form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
