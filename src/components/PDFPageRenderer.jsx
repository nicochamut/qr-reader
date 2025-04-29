// import { useEffect, useRef } from "react";
// import QRCode from "react-qr-code";
// import html2canvas from "html2canvas";

// const PDFPageRenderer = ({ productos, cliente, onRenderComplete }) => {
//   const containerRef = useRef();

//   useEffect(() => {
//     const render = async () => {
//       if (!containerRef.current) return;

//       const canvas = await html2canvas(containerRef.current, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       onRenderComplete(imgData);
//     };
//     setTimeout(render, 200); // Esperamos para asegurar que todo esté renderizado
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: "absolute",
//         top: "0",
//         left: "0",
//         width: "800px", // PX FIJOS
//         background: "#fff",
//         padding: "1rem",
//         opacity: 0, // 🔥 en vez de -9999px
//         pointerEvents: "none", // para que no puedas hacer click
//         display: "grid",
//         gridTemplateColumns: "repeat(4, 1fr)", // 4 columnas
//         gap: "1rem",
//       }}
//     >
//       {productos.map((producto) => (
//         <div
//           key={producto.cod_articulo}
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             padding: "0.5rem",
//             background: "#fff",
//             width: "180px", // 🔥 tamaño fijo
//             height: "230px", // 🔥 tamaño fijo
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-between",
//             overflow: "hidden",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "10px",
//               marginBottom: "0.5rem",
//               width: "100%",
//               height: "30px", // 🔥 altura fija
//               overflow: "hidden",
//               wordBreak: "break-word",
//               whiteSpace: "normal",
//             }}
//           >
//             {producto.ARTICULO}
//           </div>

//           <QRCode
//             value={`https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.cod_articulo}`}
//             size={80}
//             bgColor="#ffffff"
//             fgColor="#000000"
//           />

//           <div
//             style={{
//               fontSize: "9px",
//               marginTop: "0.3rem",
//               color: "#555",
//             }}
//           >
//             {producto.cod_articulo}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PDFPageRenderer;
