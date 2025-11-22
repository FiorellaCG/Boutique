import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Services from "../../services/Services";
import "../../styles/Carrusel.css";

const Carrito = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [carrito, setCarrito] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    if (!usuarioActivo.id) {
      alert("Debes iniciar sesión para ver tu carrito");
      navigate("/login");
      return;
    }
    setUsuario(usuarioActivo);
    cargarDatos(usuarioActivo.id);
  }, [navigate, searchParams]);

  const cargarDatos = async (usuarioId) => {
    try {
      const [carritosData, productosData, categoriasData] = await Promise.all([
        Services.getDatos("carritos"),
        Services.getDatos("productos"),
        Services.getDatos("categorias"),
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);

      // Buscar carrito activo del usuario
      const carritoActivo = carritosData.find(
        (c) => c.idUsuario === usuarioId && c.estado === "activo"
      );

      let carritoFinal = carritoActivo;
      
      if (!carritoFinal) {
        // Crear nuevo carrito si no existe
        const nuevoCarrito = {
          idUsuario: usuarioId,
          fechaCreacion: new Date().toISOString(),
          estado: "activo",
          items: [],
        };
        carritoFinal = await Services.postDatos("carritos", nuevoCarrito);
      }

      // Verificar si hay un producto en la URL para añadir
      const productoId = searchParams.get("producto");
      if (productoId) {
        const producto = productosData.find((p) => p.id === productoId);
        if (producto) {
          const itemExistente = carritoFinal.items.find(
            (item) => item.productoId === productoId
          );

          if (itemExistente) {
            // Incrementar cantidad si ya existe
            const itemsActualizados = carritoFinal.items.map((item) =>
              item.productoId === productoId
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            );
            carritoFinal = { ...carritoFinal, items: itemsActualizados };
          } else {
            // Añadir nuevo item
            carritoFinal = {
              ...carritoFinal,
              items: [
                ...carritoFinal.items,
                { productoId: productoId, cantidad: 1 },
              ],
            };
          }

          // Actualizar carrito en el servidor
          carritoFinal = await Services.putDatos("carritos", carritoFinal.id, carritoFinal);
          
          // Limpiar parámetro de URL
          navigate("/carrito", { replace: true });
        }
      }

      setCarrito(carritoFinal);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const obtenerPrecioProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? parseFloat(producto.precio) : 0;
  };

  const obtenerImagenProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? producto.imagen : "/img/default-product.jpg";
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(productoId);
      return;
    }

    const itemsActualizados = carrito.items.map((item) =>
      item.productoId === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );

    const carritoActualizado = { ...carrito, items: itemsActualizados };
    await Services.putDatos("carritos", carrito.id, carritoActualizado);
    setCarrito(carritoActualizado);
  };

  const eliminarProducto = async (productoId) => {
    const itemsActualizados = carrito.items.filter(
      (item) => item.productoId !== productoId
    );

    const carritoActualizado = { ...carrito, items: itemsActualizados };
    await Services.putDatos("carritos", carrito.id, carritoActualizado);
    setCarrito(carritoActualizado);
  };

  const calcularSubtotal = () => {
    if (!carrito || !carrito.items) return 0;
    return carrito.items.reduce((total, item) => {
      return total + obtenerPrecioProducto(item.productoId) * item.cantidad;
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const impuesto = subtotal * 0.13; // 13% de impuesto
    return subtotal + impuesto;
  };

  const handleCheckout = () => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    navigate("/pago", { state: { carrito } });
  };

  if (!carrito) {
    return <div>Cargando carrito...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Carrito de Compras</h2>

        {!carrito.items || carrito.items.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.items.map((item) => (
                  <tr key={item.productoId}>
                    <td>
                      <img
                        src={obtenerImagenProducto(item.productoId)}
                        alt={obtenerNombreProducto(item.productoId)}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{obtenerNombreProducto(item.productoId)}</td>
                    <td>₡{obtenerPrecioProducto(item.productoId).toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(
                            item.productoId,
                            parseInt(e.target.value)
                          )
                        }
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      ₡
                      {(
                        obtenerPrecioProducto(item.productoId) * item.cantidad
                      ).toLocaleString()}
                    </td>
                    <td>
                      <button
                        onClick={() => eliminarProducto(item.productoId)}
                        className="btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <h3>Resumen</h3>
              <p>Subtotal: ₡{calcularSubtotal().toLocaleString()}</p>
              <p>Impuesto (13%): ₡{(calcularSubtotal() * 0.13).toLocaleString()}</p>
              <p>
                <strong>Total: ₡{calcularTotal().toLocaleString()}</strong>
              </p>
              <button className="btn" onClick={handleCheckout}>
                Proceder al Pago
              </button>
            </div>
          </>
        )}

        <button className="btn-secondary" onClick={() => navigate("/home")}>
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default Carrito;

