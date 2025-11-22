import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Services from "../../services/Services";

const Factura = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const facturaParam = location.state?.factura;
  const [factura, setFactura] = useState(facturaParam);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "{}");
    if (!usuarioActivo.id) {
      navigate("/login");
      return;
    }
    setUsuario(usuarioActivo);

    if (!factura && facturaParam) {
      setFactura(facturaParam);
    } else if (!factura) {
      // Si no hay factura, intentar obtener la última del usuario
      cargarUltimaFactura(usuarioActivo.id);
    }
  }, [navigate, facturaParam]);

  const cargarUltimaFactura = async (usuarioId) => {
    try {
      const facturas = await Services.getDatos("facturas");
      const facturasUsuario = facturas.filter((f) => f.idUsuario === usuarioId);
      if (facturasUsuario.length > 0) {
        const ultimaFactura = facturasUsuario.sort(
          (a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)
        )[0];
        setFactura(ultimaFactura);
      }
    } catch (error) {
      console.error("Error al cargar factura:", error);
    }
  };

  const imprimirFactura = () => {
    window.print();
  };

  if (!factura) {
    return <div>Cargando factura...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="invoice-header">
          <h2>FACTURA DIGITAL</h2>
          <p>Bellas Boutique</p>
          <p>Factura N°: {factura.id}</p>
          <p>Fecha: {new Date(factura.fechaCompra).toLocaleDateString()}</p>
        </div>

        <div className="invoice-customer">
          <h3>Datos del Cliente</h3>
          <p>
            <strong>Nombre:</strong> {usuario?.nombre} {usuario?.apellidos}
          </p>
          <p>
            <strong>Correo:</strong> {usuario?.correo}
          </p>
          <p>
            <strong>Teléfono:</strong> {usuario?.telefono}
          </p>
        </div>

        <div className="invoice-items">
          <h3>Detalle de Productos</h3>
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
              {factura.detalleProductos?.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>₡{item.precioUnitario.toLocaleString()}</td>
                  <td>
                    ₡{(item.cantidad * item.precioUnitario).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-totals">
          <div className="invoice-total-row">
            <span>Subtotal:</span>
            <span>₡{factura.subtotal.toLocaleString()}</span>
          </div>
          <div className="invoice-total-row">
            <span>Impuesto (13%):</span>
            <span>₡{factura.impuesto.toLocaleString()}</span>
          </div>
          <div className="invoice-total-row" style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            <span>Total:</span>
            <span>₡{factura.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Gracias por su compra</p>
          <p>Bellas Boutique - Su tienda de confianza</p>
        </div>

        <div className="invoice-actions">
          <button className="btn" onClick={imprimirFactura}>
            Imprimir Factura
          </button>
          <button className="btn-secondary" onClick={() => navigate("/home")}>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Factura;

