import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    });

    scanner.render(onScanSuccess, (err) => {
      console.warn("QR Scan Error:", err);
    });

    return () => {
      scanner.clear().catch((error) => console.error("Clear error", error));
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" style={{ width: "100%" }} />;
};

export default QrScanner;
