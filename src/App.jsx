import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componentes/Login";
import Navbar from "./componentes/Navbar";
import PiePagina from "./componentes/PiePagina";
import Registro from "./componentes/Registro";
import Contacto from "./paginas/Contacto";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import PanelControl from "./paginas/PanelControl";
import VehiculosDisponibles from "./paginas/VehiculosDisponibles";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const login = (usuario) => {
    // Verificar si el usuario tiene rol de admin y loguearlo
    if (usuario && usuario.isAdmin) {
      setUsuarioLogueado(usuario);
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/vehiculos" element={<VehiculosDisponibles />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/registro" element={<Registro />} />

          {/* Ruta privada para PanelControl */}
          <Route
            path="/panelcontrol"
            element={
              usuarioLogueado ? (
                <PanelControl />
              ) : (
                // Si no, redirigir al login
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
      <PiePagina />
    </Router>
  );
}

export default App;
