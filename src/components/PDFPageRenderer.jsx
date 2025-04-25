import { useRef } from "react";

const PDFPageRenderer = ({ productos, cliente, onRenderComplete }) => {
  const containerRef = useRef();

  useEffect(() => {
    const render = async () => {
      if (!containerRef.current) return;

      const canvas = await html2canvas(containerRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      onRenderComplete(imgData);
    };
    setTimeout(render, 200); // Esperamos para asegurar que todo esté renderizado
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "800px",
        background: "#fff",
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
    >
      {productos.map((producto) => (
        <div
          key={producto.cod_articulo}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            textAlign: "center",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", marginBottom: "0.5rem" }}>
            {producto.ARTICULO}
          </div>
          <QRCode
            value={`https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.cod_articulo}`}
            size={100}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      ))}
    </div>
  );
};

export default PDFPageRenderer;
