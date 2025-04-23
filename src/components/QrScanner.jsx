import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const qrRegionId = "qr-reader";
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const rearCamera =
          devices.find((device) =>
            device.label.toLowerCase().includes("back")
          ) || devices[0];
        html5QrCodeRef.current
          .start(
            rearCamera.id,
            config,
            (decodedText) => {
              onScanSuccess(decodedText);
              html5QrCodeRef.current.stop().then(() => {
                html5QrCodeRef.current.clear();
              });
            },
            (errorMessage) => {
              // Opcional: console.log(errorMessage);
            }
          )
          .catch((err) => console.error("Error al iniciar la cámara", err));
      }
    });

    return () => {
      html5QrCodeRef.current?.stop().then(() => {
        html5QrCodeRef.current.clear();
      });
    };
  }, [onScanSuccess]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        id="qr-reader"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      />
      <button
        onClick={onClose}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "15px",
          background: "#ff5f57",
          color: "white",
          border: "none",
          fontWeight: "bold",
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default QrScanner;
