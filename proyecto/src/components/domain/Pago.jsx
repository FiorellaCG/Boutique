import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Services from "../../services/Services";

const Pago = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const carrito = location.state?.carrito;
  const [usuario, setUsuario] = useState(null);
  const [metodoPago, setMetodoPago] = useState("");
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    if (!usuarioActivo.id) {
      navigate("/login");
      return;
    }
    setUsuario(usuarioActivo);

    if (!carrito) {
      navigate("/carrito");
      return;
    }

    cargarProductos();
  }, [navigate, carrito]);

  const cargarProductos = async () => {
    try {
      const productosData = await Services.getDatos("productos");
      setProductos(productosData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const obtenerPrecioProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? parseFloat(producto.precio) : 0;
  };

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const calcularSubtotal = () => {
    if (!carrito || !carrito.items) return 0;
    return carrito.items.reduce((total, item) => {
      return total + obtenerPrecioProducto(item.productoId) * item.cantidad;
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const impuesto = subtotal * 0.13;
    return subtotal + impuesto;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodoPago) {
      setMensaje("Por favor selecciona un método de pago");
      return;
    }

    try {
      // Crear registro de pago
      const nuevoPago = {
        idUsuario: usuario.id,
        idCarrito: carrito.id,
        metodo: metodoPago,
        monto: calcularTotal(),
        estado: "Exitoso", // En producción, esto se validaría con el procesador de pagos
        fechaPago: new Date().toISOString(),
      };

      const pagoCreado = await Services.postDatos("pagos", nuevoPago);

      // Generar factura automáticamente
      const nuevaFactura = {
        idUsuario: usuario.id,
        idCarrito: carrito.id,
        idPago: pagoCreado.id,
        subtotal: calcularSubtotal(),
        impuesto: calcularSubtotal() * 0.13,
        total: calcularTotal(),
        fechaCompra: new Date().toISOString(),
        detalleProductos: carrito.items.map((item) => ({
          productoId: item.productoId,
          nombre: obtenerNombreProducto(item.productoId),
          cantidad: item.cantidad,
          precioUnitario: obtenerPrecioProducto(item.productoId),
        })),
      };

      const facturaCreada = await Services.postDatos("facturas", nuevaFactura);

      // Registrar ventas
      for (const item of carrito.items) {
        const venta = {
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: obtenerPrecioProducto(item.productoId),
          fechaVenta: new Date().toISOString(),
          idFactura: facturaCreada.id,
        };
        await Services.postDatos("ventas", venta);

        // Actualizar stock del producto
        const producto = productos.find((p) => p.id === item.productoId);
        if (producto) {
          const nuevoStock = parseInt(producto.stock) - item.cantidad;
          await Services.putDatos("productos", producto.id, {
            ...producto,
            stock: nuevoStock.toString(),
          });
        }
      }

      // Marcar carrito como completado
      await Services.putDatos("carritos", carrito.id, {
        ...carrito,
        estado: "completado",
      });

      setMensaje("✅ Pago procesado exitosamente. Redirigiendo a la factura...");
      setTimeout(() => {
        navigate("/factura", { state: { factura: facturaCreada } });
      }, 2000);
    } catch (error) {
      console.error("Error al procesar pago:", error);
      setMensaje("Error al procesar el pago: " + error.message);
    }
  };

  if (!carrito) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Proceso de Pago</h2>

        <div className="payment-summary">
          <h3>Resumen de Compra</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.items.map((item) => (
                <tr key={item.productoId}>
                  <td>{obtenerNombreProducto(item.productoId)}</td>
                  <td>{item.cantidad}</td>
                  <td>₡{obtenerPrecioProducto(item.productoId).toLocaleString()}</td>
                  <td>
                    ₡
                    {(
                      obtenerPrecioProducto(item.productoId) * item.cantidad
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>Subtotal: ₡{calcularSubtotal().toLocaleString()}</p>
            <p>Impuesto (13%): ₡{(calcularSubtotal() * 0.13).toLocaleString()}</p>
            <p>
              <strong>Total: ₡{calcularTotal().toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Selecciona el Método de Pago</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="Tarjeta"
                checked={metodoPago === "Tarjeta"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              Tarjeta
            </label>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="SINPE"
                checked={metodoPago === "SINPE"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              SINPE
            </label>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="Transferencia"
                checked={metodoPago === "Transferencia"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              Transferencia
            </label>
          </div>

          <button type="submit" className="btn">
            Confirmar Pago
          </button>
        </form>

        {mensaje && (
          <div
            className={`alert ${
              mensaje.includes("✅")
                ? "alert-success"
                : mensaje.includes("❌")
                ? "alert-error"
                : "alert-info"
            }`}
          >
            {mensaje}
          </div>
        )}

        <button className="btn-secondary" onClick={() => navigate("/carrito")}>
          Volver al Carrito
        </button>
      </div>
    </div>
  );
};

export default Pago;

