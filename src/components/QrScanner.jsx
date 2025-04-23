import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

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
              html5QrCodeRef.current.stop().then(() => {
                html5QrCodeRef.current.clear();
              });
            },
            (error) => {}
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
    <div>
      <div id="qr-reader" style={{ width: "100%", maxWidth: "400px" }} />
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default QrScanner;
