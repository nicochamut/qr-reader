import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./components/ProductPage";
import AdminPanel from "./components/AdminPanel";
import GlobalStyle from "./components/GlobalStyles";

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        {/* Ruta para el panel administrativo (si lo necesitas) */}
        <Route path="/admin/:cliente" element={<AdminPanel />} />
        {/* Ruta para la visualización del producto */}
        <Route path="/APIES/:cliente/:productId" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
