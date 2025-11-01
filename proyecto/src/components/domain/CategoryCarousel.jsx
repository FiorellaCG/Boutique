import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import "../../styles/Carrusel.css";

function CategoryCarousel() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); 

  // Cargar categorías y productos
  useEffect(() => {
    (async () => {
      const cats = await Services.getDatos("categorias");
      const prods = await Services.getDatos("productos");
      setCategorias(cats);
      setProductos(prods);
    })();
  }, []);

  // Obtener una imagen aleatoria por categoría
  const obtenerImagenCategoria = (categoriaId) => {
    const productosDeCategoria = productos.filter(
      (p) => p.categoriaId === categoriaId && p.imagen
    );
    if (productosDeCategoria.length === 0) return "/img/default-category.jpg";
    const aleatorio = Math.floor(Math.random() * productosDeCategoria.length);
    return productosDeCategoria[aleatorio].imagen;
  };

  return (
    <section className="category-carousel">
      <h2 className="carousel-title">Catálogo</h2>

      <div className="carousel-grid">
        {categorias.map((cat, index) => (
          <motion.div
            key={cat.id}
            className="category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/categoria/${cat.id}`)} 
          >
            <div className="category-img-wrapper">
              <img
                src={obtenerImagenCategoria(cat.id)}
                alt={cat.nombre}
                className="category-img"
                onError={(e) => (e.target.src = "/img/default-category.jpg")}
              />
            </div>
            <div className="category-info">
              <p>{cat.nombre}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CategoryCarousel;
