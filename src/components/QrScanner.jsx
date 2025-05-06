import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styled from "styled-components";
import { scanRegister } from "../utils/scanRegister";

const ScannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #717171;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: white;
`;

const QrContainer = styled.div`
  width: 100%;
  max-width: 350px;
  width: 18rem;
  border: 2px solid #4c98af;
  border-radius: 20px;
  overflow: hidden;
`;

const CancelButton = styled.button`
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

const QrScanner = ({ onScanSuccess, onClose }) => {
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const qrRegionId = "qr-reader";
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length) {
        const rearCamera =
          devices.find((d) => d.label.toLowerCase().includes("back")) ||
          devices[0];
        html5QrCodeRef.current
          .start(
            rearCamera.id,
            config,
            (decodedText) => {
              onScanSuccess(decodedText);

              // Suponiendo que el cliente está codificado en la URL y el producto también
              const url = new URL(decodedText);
              const pathParts = url.pathname.split("/"); // ['','apies','orlando','1234']
              const cliente = pathParts[2];
              const producto_id = pathParts[3];

              scanRegister({
                cliente,
                producto_id,
                descripcion: "", // Si podés obtenerla después mejor
                rubro: "",
                user_agent: navigator.userAgent,
                ip: "", // Podés obtenerla más adelante si querés
              });

              html5QrCodeRef.current.stop().then(() => {
                html5QrCodeRef.current.clear();
              });
            },
            () => {}
          )
          .catch((err) => console.error("Error al iniciar QR", err));
      }
    });

    return () => {
      html5QrCodeRef.current?.stop().then(() => {
        html5QrCodeRef.current.clear();
      });
    };
  }, [onScanSuccess]);

  return (
    <ScannerWrapper>
      <QrContainer id="qr-reader" />
      <CancelButton onClick={onClose}>Cancelar</CancelButton>
    </ScannerWrapper>
  );
};

export default QrScanner;
