import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Admin.css"
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/domain/CategoryList";
import CategoryForm from "../components/domain/CategoryForm";
import ProductList from "../components/domain/ProductList";
import ProductForm from "../components/domain/ProductForm";

const Admin = () => {
    const navigate = useNavigate();
    const [view, setView] = useState("home");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Animaciones suaves para entrada y salida
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const renderView = () => {
        switch (view) {
            case "categories":
                return (
                    <CategoryList
                        onAdd={() => {
                            setSelectedCategory(null);
                            setView("addCategory");
                        }}
                        onEdit={(cat) => {
                            setSelectedCategory(cat);
                            setView("editCategory");
                        }}
                    />
                );

            case "addCategory":
                return (
                    <CategoryForm
                        onCancel={() => setView("categories")}
                        onSuccess={() => setView("categories")}
                    />
                );

            case "editCategory":
                return (
                    <CategoryForm
                        categoriaEdit={selectedCategory}
                        onCancel={() => setView("categories")}
                        onSuccess={() => setView("categories")}
                    />
                );

            case "products":
                return (
                    <ProductList
                        onAdd={() => {
                            setSelectedProduct(null);
                            setView("addProduct");
                        }}
                        onEdit={(prod) => {
                            setSelectedProduct(prod);
                            setView("editProduct");
                        }}
                    />
                );

            case "addProduct":
                return (
                    <ProductForm
                        onCancel={() => setView("products")}
                        onSuccess={() => setView("products")}
                    />
                );

            case "editProduct":
                return (
                    <ProductForm
                        productoEdit={selectedProduct}
                        onCancel={() => setView("products")}
                        onSuccess={() => setView("products")}
                    />
                );

        }
    };

    return (
        <motion.div
            className="admin-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="admin-title">Panel de Administración</h1>
            <p className="admin-subtitle">Gestiona los productos de Bellas Boutique.</p>

            {/* 🔹 Navegación principal */}
            <motion.div
                className="admin-buttons"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <button
                    className={view.includes("category") ? "active" : ""}
                    onClick={() => setView("categories")}
                >
                    Categorías
                </button>
                <button
                    className={view.includes("product") ? "active" : ""}
                    onClick={() => setView("products")}
                >
                    Productos
                </button>
                <button
                    onClick={() => navigate("/home")}
                >
                    Volver al Home
                </button>

            </motion.div>

            {/* 🔹 Contenido animado */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="admin-content"
                >
                    {renderView()}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default Admin;
