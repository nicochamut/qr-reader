import React, { useState, useEffect } from "react";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import oleumlogo from "../assets/oleumlogo.png";
import backghome from "../assets/backghome.png";
import { scanRegister } from "../utils/scanRegister";
import instagramlogo from "../assets/instagram.png";

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

  .oleumlogo {
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
  color:rgb(156, 156, 156);
  font-size: 12px;
  text-align: center;
  width: 100%;
  opacity: 0.5;
  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: inherit;
    text-decoration: none;
    font-weight: bold;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }

    img {
      width: 14px;
      height: 14px;
      align-self: center;
      margin-right: -4px;
    }
  }
`;

const HomeScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [productos, setProductos] = useState([]);

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

      fetch(`/apies/${cliente}/products.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.json();
        })
        .then((productos) => {
          console.log("Lista completa de productos:", productos);

          const producto = productos.find(
            (p) => p.cod_articulo === producto_id
          );

          if (!producto) {
            console.error("❌ Producto no encontrado en products.json");
            alert("Producto no encontrado");
            return;
          }

          console.log("✅ Producto encontrado:", producto);

          scanRegister({
            cliente,
            producto_id,
            descripcion: producto.articulo,
            rubro: producto.rubro || "",
            user_agent: navigator.userAgent,
            ip: "",
          });

          window.location.href = `/apies/${cliente}/${producto_id}`;
        })
        .catch((err) => {
          console.error("❌ Error cargando productos:", err);
          alert("Hubo un problema cargando la lista de productos.");
        });
    } catch (err) {
      alert("Código QR inválido");
    }
  };

  const handleCloseScanner = () => {
    setIsScannerActive(false);
  };

  return (
    <HomeContainer backghome={backghome}>
      <img src={oleumlogo} alt="Logo" className="oleumlogo" />
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
      <Footer>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          Developed by{" "}
          <a
            href="https://www.instagram.com/fibotec.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={instagramlogo}
              alt="Instagram"
              style={{ width: 14, height: 14 }}
            />
            Fibotec
          </a>
        </span>
      </Footer>
    </HomeContainer>
  );
};

export default HomeScanner;
