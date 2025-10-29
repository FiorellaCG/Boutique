import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Register from '../pages/Register';
import RecuperarPassword from '../components/domain/RecuperarPassword';
import Admin from '../pages/Admin';
import LoginForm from '../pages/LoginForm';
import ProductCarousel from '../components/domain/ProductCarousel';
import CategoriaProductos from '../pages/CategoriaProductos';


function Routing() {
  return (

    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/recuperar" element={<RecuperarPassword/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/productos" element={<ProductCarousel/>}/>
        <Route path="/categoria/:id" element={<CategoriaProductos />}/>
      </Routes>
    </Router>
  );
}

export default Routing