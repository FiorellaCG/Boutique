import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Services from "../../services/Services";
import "../../styles/Carrusel.css"; // reutiliza los mismos estilos

function CategoryProducts() {
  const { id } = useParams(); // Obtiene el ID de la categoría desde la URL
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    (async () => {
      const catsResponse = await Services.getDatos("categorias");
      const prodsResponse = await Services.getDatos("productos");

      const cats = catsResponse.categorias || catsResponse;
      const prods = prodsResponse.productos || prodsResponse;

      // 🔹 Busca la categoría actual por id (en texto)
      const categoriaSeleccionada = cats.find((c) => c.id === id);
      setCategoria(categoriaSeleccionada);

      // 🔹 Filtra productos por el campo categoriaId (que es string)
      const productosFiltrados = prods.filter((p) => p.categoriaId === id);
      setProductos(productosFiltrados);
    })();
  }, [id]);

  if (!categoria) return <p>Cargando...</p>;

  return (
    <section className="category-carousel">
      <h2 className="carousel-title">{categoria.nombre}</h2>

      <div className="carousel-grid">
        {productos.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
        ) : (
          productos.map((prod, index) => (
            <motion.div
              key={prod.id}
              className="category-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="category-img-wrapper">
                <img
                  src={prod.imagen || "/img/default-product.jpg"}
                  alt={prod.nombre}
                  className="category-img"
                  onError={(e) => (e.target.src = "/img/default-product.jpg")}
                />
              </div>

              <div className="category-info">
                <p className="product-name">{prod.nombre}</p>
                <p className="product-price">₡{prod.precio}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

export default CategoryProducts;

