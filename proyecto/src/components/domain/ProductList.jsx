import React, { useEffect, useState } from "react";
import Services from "../../services/Services";

const ProductList = ({ onAdd, onEdit }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          Services.getDatos("productos"),
          Services.getDatos("categorias"),
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener productos o categorías:", error);
      }
    };
    fetchData();
  }, []);

  // Obtener el nombre de la categoría según el ID
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Deseas eliminar este producto?")) {
      await Services.eliminateDatos("productos", id);
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <h2>Lista de Productos</h2>

      <button className="add-button" onClick={onAdd}>
        + Agregar Producto
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Proveedor</th> 
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.length > 0 ? (
            productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.proveedor || "Sin proveedor"}</td> 
                <td>₡{p.precio}</td>
                <td>{p.stock}</td>
                <td>{getCategoriaNombre(p.categoriaId)}</td>
                <td>
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: "6px",
                        objectFit: "cover",
                        backgroundColor: "#f5f5f5",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>Sin imagen</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(p)}>Editar</button>
                    <button onClick={() => eliminarProducto(p.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
                No hay productos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
