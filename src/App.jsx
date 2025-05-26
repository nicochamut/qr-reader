import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./components/ProductPage";
import AdminPanel from "./components/AdminPanel";
import QRManager from "./components/QRManager";
import ListManager from "./components/ListManager/ListManager";
import GlobalStyle from "./components/GlobalStyles";
import Login from "./components/Login";
import HomeScanner from "./components/HomeScanner";
import CategoryView from "./components/CategoryView";

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        {/* Página principal del scanner */}
        <Route path="/" element={<HomeScanner />} />

        {/* Vista de rubros */}
        <Route
          path="/apies/:cliente/rubros/:rubro"
          element={<CategoryView />}
        />

        {/* Página de visualización de un producto */}
        <Route path="/APIES/:cliente/:productId" element={<ProductPage />} />

        {/* Panel administrativo con selector */}
        <Route path="/admin/:estacion" element={<AdminPanel />} />

        {/* Subvistas del panel administrativo */}
        <Route path="/admin/:cliente/qrs" element={<QRManager />} />
        <Route path="/admin/:estacion/listas" element={<ListManager />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
