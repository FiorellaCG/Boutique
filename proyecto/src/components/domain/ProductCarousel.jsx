import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import "../../styles/Carrusel.css";

function ProductCarousel() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  // Cargar productos
  useEffect(() => {
    (async () => {
      const prods = await Services.getDatos("productos");
      setProductos(prods);
    })();
  }, []);

  return (
    <section className="category-carousel">
      <h2 className="carousel-title">Observa nuestra gran variedad de diseños</h2>

      <div className="carousel-grid">
        {productos.map((prod, index) => (
          <motion.div
            key={prod.id}
            className="category-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
              <p className="product-price">₡{prod.precio?.toLocaleString()}</p>
              <p className="product-category">{prod.categoriaNombre}</p>
              <button 
                className="btn-add-cart"
                onClick={() => {
                  const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
                  if (!usuario.id) {
                    alert("Debes iniciar sesión para añadir productos al carrito");
                    navigate("/login");
                    return;
                  }
                  navigate(`/carrito?producto=${prod.id}`);
                }}
              >
                Añadir al carrito
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProductCarousel;
