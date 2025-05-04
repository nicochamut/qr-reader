import React, { useState } from "react";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import oleumlogo from "../assets/oleumlogo.png";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: hsla(198, 99%, 43%, 1);
  color: white;
  font-family: "Montserrat", sans-serif;

  img {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 30px;
  }
  background: linear-gradient(to bottom, #23514e 0%, #4a7f6c 70%, #d1d1d1 100%);
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
  font-family: "poppins", sans-serif;
  &:hover {
    background-color: #0056b3;
  }
`;

const ResultText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  color: #1b1b1b;
  font-size: 12px;
`;

const HomeScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedText, setScannedText] = useState("");

  const handleScanClick = () => {
    setIsScannerActive(true);
  };

  const handleScanSuccess = (text) => {
    setScannedText(text);
    setIsScannerActive(false); // Cierra el escáner después de un escaneo exitoso
  };

  const handleCloseScanner = () => {
    setIsScannerActive(false);
  };

  return (
    <HomeContainer>
      <img src={oleumlogo} alt="Logo" />
      <h1>Bienvenido!</h1>
      {!isScannerActive && (
        <ScanButton onClick={handleScanClick}>Scanner de QRs</ScanButton>
      )}
      {isScannerActive && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleCloseScanner}
        />
      )}
      {scannedText && <ResultText>Scanned Text: {scannedText}</ResultText>}
      <Footer>Developed by @Fibotec</Footer>
    </HomeContainer>
  );
};

export default HomeScanner;
