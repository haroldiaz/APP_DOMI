
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MenuPrincipal from "./pages/MenuPrincipal";
import RegistroProducto from "./pages/RegistroProductos";

import Login from "./pages/Login";
import PanelDomiciliario from "./pages/PanelDomiciliario";



// Página provisional para las secciones que aún no tienen componente.
const PaginaProvisional = ({ titulo }) => {
  return (
    <div style={{ padding: "32px" }}>
      <h1>{titulo}</h1>
      <p>
        Esta sección de App Domi está preparada para desarrollar.
      </p>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Menú principal */}
        <Route path="/" element={<Login />} />
|       <Route
          path="/menuPrincial"
          element={<MenuPrincipal />}
        />
       |<Route
          path="/productos"
          element={<RegistroProducto />}
        />

        
        <Route
          path="/categorias"
          element={<PaginaProvisional titulo="Categorías" />}
        />

        <Route
          path="/domiciliarios"
          element={<PanelDomiciliario />}
        />

        <Route
          path="/reportes"
          element={<PaginaProvisional titulo="Reportes" />}
        />

        <Route
          path="/configuracion"
          element={<PaginaProvisional titulo="Configuración" />}
        />

        {/* Redirigir rutas desconocidas al menú */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
