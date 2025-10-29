import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Header.css"

const Header = () => {
  const location = useLocation();

  const links = [
    { name: "Productos", path: "/productos" },
    { name: "Registro", path: "/registro" },
    { name: "Login", path: "/login" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <header className="header">
      <div className="logo">Bellas Boutique</div>

      <nav className="nav-links">
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`nav-item ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
