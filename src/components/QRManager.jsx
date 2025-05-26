import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import QRGenerator from "qrcode"; // <-- usamos esta para el PDF

import styled, { keyframes } from "styled-components";

// 🎯 Toast para errores
const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4d4f;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: bold;
  z-index: 9999;
  animation: ${keyframes`
    0% {opacity: 0;}
    10% {opacity: 1;}
    90% {opacity: 1;}
    100% {opacity: 0;}
  `} 3s forwards;
`;

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #616161, #3d3d3d);
  height: 100%;
  min-height: 100vh;

  .search {
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: #ffffff;
    background-color: #2c2c2c;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.813);
    outline: none;
    transition: all 0.3s ease;
    width: 40rem;
  }

  .search::placeholder {
    color: #aaaaaa;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 2.7rem;
  padding-top: 2rem;
  margin-left: 5rem;
`;

const LogoutButton = styled.button`
  font-size: 1.2rem;
  position: absolute;
  right: 1rem;
  top: 1.5rem;
  color: red;
  border: none;
  cursor: pointer;
  background: #450c0c;
  padding: 0.7rem;
  border-radius: 12px;
  &&:hover {
    background: #691515;
  }
`;

const Input = styled.input`
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.875rem;
`;

const GenerateButton = styled.button`
  margin-left: 1rem;
  background-color: #2563eb;
  font-size: 1.2rem;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const QRGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 5rem;
  gap: 2rem;
  margin: 5rem;
  border-radius: 1rem;
  background: linear-gradient(to right, #2e2e2e, #2f2f2f);
  box-shadow: 5px 15px 10px black;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const QRCard = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 16px;
  background: #fff;
  min-height: 7rem;
  width: 19rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  .checkbox-container {
    position: absolute;
    top: 8px;
    right: 8px;
    height: 24px;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(1);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .checkbox-container input {
    opacity: 0; /* ocultamos el input original */

    width: 0;
    height: 0;
  }

  .checkbox-container .checkmark {
    height: 24px;
    width: 24px;
    background-color: #f0f0f0; /* gris claro SIEMPRE visible */
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    position: relative;
    transform: scale(1.2);
    background-color: #e2af5d;
  }

  /* Cuando está checked */
  .checkbox-container input:checked + .checkmark {
    background-color: #5dade2; /* pasa a azul */
  }

  /* El tilde (invisible por defecto) */
  .checkbox-container .checkmark::after {
    content: "";
    position: absolute;
    display: none;
  }

  /* El tilde aparece solo cuando está checked */
  .checkbox-container input:checked + .checkmark::after {
    display: block;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  //card
  &&:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const RubrosCard = styled.div`
  padding: 1rem;

  border-radius: 0.7rem;
  background: linear-gradient(to right, #f6f6f6, #e3e3e3);
  color: #000000;
  min-height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-shadow: 5px 4px 12px rgba(0, 0, 0, 0.524);
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &&:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  position: absolute;
  left: 6.5rem;

  label {
    margin-left: 0.5rem;
    font-size: 1rem;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const Pagination = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: white;
  button {
    background: #fff;
    color: #000000;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const QRManager = () => {
  const { cliente } = useParams();

  const navigate = useNavigate();
  const [listaPrecioSeleccionada, setListaPrecioSeleccionada] = useState("1");
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("rubros"); // "rubros" o "productos"
  const [rubroSeleccionado, setRubroSeleccionado] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [busquedaRubro, setBusquedaRubro] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(
          `/apies/${cliente.toLowerCase()}/products.json`
        );
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, [cliente]);

  const descargarQRRubroPDF = async () => {
    try {
      const url = `https://www.oleumprecios.com/apies/${cliente}/rubros/${encodeURIComponent(
        rubroSeleccionado
      )}`;
      const dataUrl = await QRGenerator.toDataURL(url, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Rubro: ${rubroSeleccionado}`, 20, 30);

      doc.addImage(dataUrl, "PNG", 50, 50, 100, 100);

      doc.save(`qr_rubro_${rubroSeleccionado}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF del QR del rubro:", err);
    }
  };

  const productosPorRubro = productos
    .filter((p) => p.rubro?.toLowerCase() === rubroSeleccionado?.toLowerCase())
    .filter((p) => {
      if (listaPrecioSeleccionada) {
        return p.cod_lista_precio === listaPrecioSeleccionada;
      }
      return true;
    });

  const rubrosUnicos = [...new Set(productos.map((p) => p.rubro))].filter(
    Boolean
  );

  const listasDePrecioUnicas = [
    ...new Set(productos.map((p) => p.cod_lista_precio)),
  ].filter(Boolean);

  const toggleSeleccionado = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const seleccionarTodosDelRubro = () => {
    const ids = productosPorRubro.map((p) => p.cod_articulo);
    setSeleccionados(ids);
  };

  const deseleccionarTodos = () => {
    setSeleccionados([]);
  };

  const rubrosFiltrados = rubrosUnicos.filter((rubro) =>
    rubro.toLowerCase().includes(busquedaRubro.toLowerCase())
  );

  const generarPDF = async () => {
    const itemsParaImprimir =
      seleccionados.length > 0
        ? productosPorRubro.filter((p) =>
            seleccionados.includes(p.cod_articulo)
          )
        : productosPorRubro;

    if (!itemsParaImprimir.length) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      return;
    }

    const doc = new jsPDF();
    let x = 12; // 🔥 buen margen
    let y = 20;
    let count = 0;

    for (let i = 0; i < itemsParaImprimir.length; i++) {
      const producto = itemsParaImprimir[i];

      try {
        const url = `https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.cod_articulo}`;
        const dataUrl = await QRGenerator.toDataURL(url, {
          errorCorrectionLevel: "H",
          type: "image/png",
          width: 200,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        });

        // QR
        const qrSize = 50;
        doc.addImage(dataUrl, "PNG", x, y, qrSize, qrSize);

        // Título arriba
        doc.setFontSize(10);
        const titulo = producto.articulo;
        const maxWidth = 50;
        const splitTitulo = doc.splitTextToSize(titulo, maxWidth);

        splitTitulo.forEach((line, index) => {
          const lineWidth = doc.getTextWidth(line);
          doc.text(
            line,
            x + qrSize / 2 - lineWidth / 2,
            y - (splitTitulo.length - index) * 4
          );
        });

        // Código abajo
        doc.setFontSize(9);
        const codigo = producto.cod_articulo.toString();
        const codWidth = doc.getTextWidth(codigo);
        doc.text(codigo, x + qrSize / 2 - codWidth / 2, y + qrSize + 6);

        // Avanzar
        count++;
        x += 65; // 🔥 65mm horizontalmente por QR + espacio

        if (count % 3 === 0) {
          // 🔥 salto de fila cada 3 QRs
          x = 12;
          y += 80; // 🔥 90mm por fila
        }

        // Si la hoja se llena, nueva página
        if (y + 90 > 280 || i === itemsParaImprimir.length - 1) {
          if (i !== itemsParaImprimir.length - 1) {
            doc.addPage();
            x = 20;
            y = 25;
          }
        }
      } catch (err) {
        console.error("Error generando QR:", err);
      }
    }

    doc.save(`qrs_${cliente}_${rubroSeleccionado}.pdf`);
  };

  return (
    <Container>
      {toastVisible && (
        <Toast>No hay productos seleccionados para generar el PDF.</Toast>
      )}

      <Header>
        <GenerateButton
          style={{
            position: "absolute",
            left: "1rem",
            top: "1.5rem",
            backgroundColor: "#33749c",
          }}
          onClick={() => navigate(-1)}
        >
          ← Volver atrás
        </GenerateButton>
        <Title>Panel QRS </Title>
        <LogoutButton onClick={() => signOut(getAuth())}>
          Cerrar sesión
        </LogoutButton>
      </Header>
      <ToggleContainer>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <label style={{ color: "white", marginRight: "0.5rem" }}>
            ID lista de precio:
          </label>
          <select
            value={listaPrecioSeleccionada}
            onChange={(e) => setListaPrecioSeleccionada(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              fontSize: "1rem",
              backgroundColor: "#f5f5f5",
            }}
          >
            <option value="">Todas</option>
            {listasDePrecioUnicas.map((lista) => (
              <option key={lista} value={lista}>
                {lista}
              </option>
            ))}
          </select>
        </div>
      </ToggleContainer>

      {vista === "rubros" && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <Input
            type="text"
            className="search"
            value={busquedaRubro}
            onChange={(e) => setBusquedaRubro(e.target.value)}
            placeholder="Buscar rubro..."
            style={{ width: "50%", marginBottom: "2rem" }}
          />
        </div>
      )}

      {vista === "rubros" ? (
        <>
          <h2 style={{ color: "white", marginLeft: "5rem", fontSize: "2rem" }}>
            Selecciona un Rubro
          </h2>

          <QRGrid>
            {rubrosFiltrados.map((rubro) => (
              <RubrosCard
                key={rubro}
                onClick={() => {
                  setRubroSeleccionado(rubro);
                  setVista("productos");
                  setSeleccionados([]);
                }}
              >
                <h3>{rubro}</h3>
              </RubrosCard>
            ))}
          </QRGrid>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <GenerateButton onClick={() => setVista("rubros")}>
              ← Volver a Rubros
            </GenerateButton>
          </div>

          <h2 style={{ color: "white" }}>{rubroSeleccionado}</h2>

          {/* QR general del rubro y botón para descargarlo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>
              QR del Rubro
            </h3>
            <div
              style={{
                display: "inline-block",
                background: "#fff",
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <QRCode
                value={`https://oleumprecios.com/apies/${cliente}/rubros/${encodeURIComponent(
                  rubroSeleccionado
                )}`}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <GenerateButton
                onClick={() => descargarQRRubroPDF()}
                style={{ backgroundColor: "#16a34a" }}
              >
                Descargar PDF del QR Rubro
              </GenerateButton>
            </div>
          </div>

          {/* Botones de selección/deselección */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <GenerateButton onClick={seleccionarTodosDelRubro}>
              Seleccionar todos
            </GenerateButton>
            <GenerateButton
              onClick={deseleccionarTodos}
              style={{ marginLeft: "1rem", backgroundColor: "#e53e3e" }}
            >
              Deseleccionar todo
            </GenerateButton>
            <GenerateButton
              onClick={generarPDF}
              style={{ marginLeft: "1rem", backgroundColor: "#2563eb" }}
            >
              Descargar PDF
            </GenerateButton>
            <p style={{ marginTop: "0.5rem", color: "white" }}>
              QRs seleccionados: {seleccionados.length}
            </p>
          </div>

          {/* Lista de QRs de productos */}
          <QRGrid>
            {productosPorRubro.map((producto, index) => (
              <QRCard
                key={`${producto.cod_articulo}_${index}`}
                onClick={() => toggleSeleccionado(producto.cod_articulo)}
              >
                <label
                  className="checkbox-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(producto.cod_articulo)}
                    onChange={() => toggleSeleccionado(producto.cod_articulo)}
                  />
                  <span className="checkmark"></span>
                </label>

                <h3>{producto.articulo}</h3>
                <QRCode
                  value={`https://oleumprecios.com/apies/${cliente}/${producto.cod_articulo}`}
                  size={170}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
                <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  {producto.cod_articulo}
                </p>
              </QRCard>
            ))}
          </QRGrid>
        </>
      )}
    </Container>
  );
};

export default QRManager;
