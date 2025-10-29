import React from "react";
import "../../styles/ImagenFondo.css"
import Fondo from "../../img/Fondo.png";

const ImagenFondo = () => {
  return (
    <div className="imagen-fondo">
      <img src={Fondo} alt="Fondo Bellas Boutique" className="fondo-img" />
      <div className="texto-superpuesto">
        <h1>Bellas Boutique</h1>
        <p>Un nuevo concepto en moda y estilo</p>
      </div>
    </div>
  );
};

export default ImagenFondo;
