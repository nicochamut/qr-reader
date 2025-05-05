import React, { useState } from "react";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import oleumlogo from "../assets/oleumlogo.png";
import backghome from "../assets/backghome.png";

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

  const handleScanClick = () => {
    setIsScannerActive(true);
  };

  const handleScanSuccess = (text) => {
    try {
      const url = new URL(text);
      const pathParts = url.pathname.split("/"); // ['', 'apies', '{cliente}', '{id}']
      const cliente = pathParts[2];
      const id = pathParts[3];

      if (cliente && id) {
        // Redirección clásica como en ProductDetails
        window.location.href = `/apies/${cliente}/${id}`;
      } else {
        alert("QR inválido");
      }
    } catch (err) {
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
