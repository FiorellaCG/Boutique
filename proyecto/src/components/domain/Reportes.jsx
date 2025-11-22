import React, { useEffect, useState } from "react";
import Services from "../../services/Services";

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("mensual"); // "diario" o "mensual"
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    cargarDatos();
  }, [filtroFecha, fechaSeleccionada]);

  const cargarDatos = async () => {
    try {
      const [ventasData, productosData] = await Promise.all([
        Services.getDatos("ventas"),
        Services.getDatos("productos"),
      ]);

      setVentas(ventasData);
      setProductos(productosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const filtrarVentas = () => {
    if (!ventas || ventas.length === 0) return [];

    const fecha = new Date(fechaSeleccionada);

    if (filtroFecha === "diario") {
      return ventas.filter((venta) => {
        const fechaVenta = new Date(venta.fechaVenta);
        return (
          fechaVenta.getDate() === fecha.getDate() &&
          fechaVenta.getMonth() === fecha.getMonth() &&
          fechaVenta.getFullYear() === fecha.getFullYear()
        );
      });
    } else {
      // Mensual
      return ventas.filter((venta) => {
        const fechaVenta = new Date(venta.fechaVenta);
        return (
          fechaVenta.getMonth() === fecha.getMonth() &&
          fechaVenta.getFullYear() === fecha.getFullYear()
        );
      });
    }
  };

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const calcularEstadisticas = () => {
    const ventasFiltradas = filtrarVentas();

    const cantidadProductos = ventasFiltradas.reduce(
      (total, venta) => total + venta.cantidad,
      0
    );

    const ingresos = ventasFiltradas.reduce(
      (total, venta) => total + venta.precioUnitario * venta.cantidad,
      0
    );

    // Agrupar por producto
    const productosVendidos = {};
    ventasFiltradas.forEach((venta) => {
      if (!productosVendidos[venta.productoId]) {
        productosVendidos[venta.productoId] = {
          nombre: obtenerNombreProducto(venta.productoId),
          cantidad: 0,
          ingresos: 0,
        };
      }
      productosVendidos[venta.productoId].cantidad += venta.cantidad;
      productosVendidos[venta.productoId].ingresos +=
        venta.precioUnitario * venta.cantidad;
    });

    return {
      cantidadProductos,
      ingresos,
      productosVendidos: Object.values(productosVendidos),
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className="container">
      <div className="card">
        <h2>Reportes de Ventas</h2>

        <div className="report-filters">
          <label>
            Tipo de Reporte:
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            >
              <option value="diario">Diario</option>
              <option value="mensual">Mensual</option>
            </select>
          </label>

          <label>
            Fecha:
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </label>
        </div>

        <div className="report-summary">
          <h3>
            Resumen {filtroFecha === "diario" ? "Diario" : "Mensual"}
          </h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Cantidad de Productos Vendidos</h4>
              <p className="summary-value">{estadisticas.cantidadProductos}</p>
            </div>
            <div className="summary-card">
              <h4>Ingresos Generados</h4>
              <p className="summary-value">
                ₡{estadisticas.ingresos.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="report-details">
          <h3>Detalle por Producto</h3>
          {estadisticas.productosVendidos.length === 0 ? (
            <p>No hay ventas para el período seleccionado</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.productosVendidos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>₡{producto.ingresos.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportes;

