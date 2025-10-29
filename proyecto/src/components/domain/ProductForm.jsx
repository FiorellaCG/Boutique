import React, { useState, useEffect } from "react";
import Services from "../../services/Services";

const ProductForm = ({ productoEdit, onCancel, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoriaId: "",
    proveedor: "",
    imagen: ""
  });

  useEffect(() => {
    Services.getDatos("categorias").then(setCategorias);
    if (productoEdit) setForm(productoEdit);
  }, [productoEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productoEdit) {
        await Services.putDatos("productos", productoEdit.id, form);
      } else {
        await Services.postDatos("productos", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar producto", error);
    }
  };

  return (
    <div className="admin-section">
      <h2>{productoEdit ? "Editar Producto" : "Nuevo Producto"}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Nombre:</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          required
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <label>Categoría:</label>
        <select
          name="categoriaId"
          value={form.categoriaId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <label>Proveedor:</label>
        <input
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          placeholder="Nombre del proveedor"
          required
        />

        <label>URL de imagen:</label>
        <input
          name="imagen"
          value={form.imagen}
          onChange={handleChange}
          placeholder="https://..."
        />

        {/* Vista previa de la imagen */}
        {form.imagen && (
          <div className="image-preview" style={{ marginTop: "10px" }}>
            <p>Vista previa:</p>
            <img
              src={form.imagen}
              alt="Vista previa"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
              onError={(e) => (e.target.style.display = "none")} // si la URL no es válida
            />
          </div>
        )}

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

export default ProductForm;

