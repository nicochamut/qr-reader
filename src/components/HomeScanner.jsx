import React, { useState, useEffect } from "react";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import oleumlogo from "../assets/oleumlogo.png";
import backghome from "../assets/backghome.png";
import { scanRegister } from "../utils/scanRegister";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  background: linear-gradient(120deg, #23514e 0%, #4a7f6c 70%, #d1d1d1 100%);
  background-image: url(${(props) => props.backghome});
  background-size: cover;
  color: white;
  font-family: "Montserrat", sans-serif;
  width: 100%;
  p {
    font-size: 12px;
    text-align: center;
    margin: 0 20px;
    color: #fdfdfd;
    margin-bottom: 1.5rem;
  }

  img {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
  }
`;

const ScanButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #b42121c0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #0056b3;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 3rem;
  color: #ffffff;
  font-size: 12px;
`;

const HomeScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const cliente = pathParts[2];

    fetch(`/apies/${cliente}/products.json`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const handleScanClick = () => {
    setIsScannerActive(true);
  };

  const handleScanSuccess = (text) => {
    try {
      console.log("QR leído:", text);

      const url = new URL(text);
      const pathParts = url.pathname.split("/");
      const cliente = pathParts[2];
      const producto_id = pathParts[3];

      console.log("Cliente:", cliente);
      console.log("Producto ID extraído del QR:", producto_id);

      const producto = productos.find(
        (p) => String(p.cod_articulo) === String(producto_id)
      );

      if (!producto) {
        console.error("Producto no encontrado en products.json");
        console.log("Lista completa de productos:", productos);
        alert("Producto no encontrado");
        return;
      }

      // Registrar escaneo en Supabase
      scanRegister({
        cliente,
        producto_id,
        descripcion: producto.articulo,
        rubro: producto.rubro || "",
        user_agent: navigator.userAgent,
        ip: "",
      });

      // Redirigir al detalle del producto
      window.location.href = `/apies/${cliente}/${producto_id}`;
    } catch (err) {
      console.error("Error al procesar QR:", err);
      alert("Código QR inválido");
    }
  };

  const handleCloseScanner = () => {
    setIsScannerActive(false);
  };

  return (
    <HomeContainer backghome={backghome}>
      <img src={oleumlogo} alt="Logo" />
      <h1>¡Bienvenido!</h1>
      <p>
        Para ver los precios, tocá el botón y permití el acceso a la cámara.
      </p>

      {!isScannerActive && (
        <ScanButton onClick={handleScanClick}>Scanner de QRs</ScanButton>
      )}

      {isScannerActive && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleCloseScanner}
        />
      )}

      <Footer>Developed by @Fibotec</Footer>
    </HomeContainer>
  );
};

export default HomeScanner;
