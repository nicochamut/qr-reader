import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./components/ProductPage";
import AdminPanel from "./components/AdminPanel";
import GlobalStyle from "./components/GlobalStyles";
import Login from "./components/Login";
import HomeScanner from "./components/HomeScanner";

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        {/* Ruta para la visualización del producto */}
        <Route path="/" element={<HomeScanner />} />
        <Route path="/APIES/:cliente/:productId" element={<ProductPage />} />
        <Route path="/admin/:cliente" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
