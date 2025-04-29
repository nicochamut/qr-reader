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
    font-family: "Poppins", sans-serif; /* Fuente moderna */
    font-size: 1rem; /* Tamaño legible */
    font-weight: 400; /* Grosor cómodo */
    color: #ffffff; /* Color del texto */
    background-color: #2c2c2c; /* Fondo oscuro moderno */
    padding: 0.75rem 1rem; /* Espaciado interno */
    border: none; /* Sin borde feo por defecto */
    border-radius: 0.5rem; /* Bordes redondeados */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.813); /* Sombra suave */
    outline: none; /* Saca el borde azul feo al hacer focus */
    transition: all 0.3s ease;
    width: 40rem;
  }

  .search::placeholder {
    color: #aaaaaa; /* Placeholder más sutil */
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
  right: 2rem;
  top: 4rem;
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

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
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

const AdminPanel = () => {
  const { cliente } = useParams();
  const navigate = useNavigate();
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

  const productosPorRubro = productos.filter(
    (p) => p.rubro?.toLowerCase() === rubroSeleccionado?.toLowerCase()
  );

  const rubrosUnicos = [...new Set(productos.map((p) => p.rubro))].filter(
    Boolean
  );

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
    let x = 15;
    let y = 25;
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

        doc.setFontSize(10);
        const titulo = producto.articulo.slice(0, 35);
        const tituloWidth = doc.getTextWidth(titulo);
        doc.text(titulo, x + 25 - tituloWidth / 2, y - 4);

        doc.addImage(dataUrl, "PNG", x, y, 50, 50);

        doc.setFontSize(9);
        const codigo = producto.cod_articulo.toString();
        const codWidth = doc.getTextWidth(codigo);
        doc.text(codigo, x + 25 - codWidth / 2, y + 58);

        count++;
        x += 65;

        if (count % 3 === 0) {
          x = 15;
          y += 75;
        }

        if (y + 75 > 280 || i === itemsParaImprimir.length - 1) {
          if (i !== itemsParaImprimir.length - 1) {
            doc.addPage();
            x = 15;
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
        <Title>Panel QRS </Title>
        <LogoutButton onClick={() => signOut(getAuth())}>
          Cerrar sesión
        </LogoutButton>
      </Header>

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

          <QRGrid>
            {productosPorRubro.map((producto, index) => (
              <QRCard
                key={`${producto.cod_articulo}_${index}`}
                onClick={() => toggleSeleccionado(producto.cod_articulo)} // 🎯 ahora la card escucha el click
              >
                <label
                  className="checkbox-container"
                  onClick={(e) => e.stopPropagation()} // 🎯 para que NO dispare doble cuando clickeás el checkbox
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
                  value={`https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.cod_articulo}`}
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

export default AdminPanel;
