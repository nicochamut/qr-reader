import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import QRGenerator from "qrcode"; // <-- usamos esta para el PDF

import styled, { keyframes } from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #0b0b0b, #3d3d3d);
  height: 100%;
  min-height: 100vh;
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
  font-size: 2.5rem;
  padding-top: 2rem;
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
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const QRGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
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
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 16px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &&:hover {
    transform: scale(1.02);
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
  const [rubro, setRubro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 30;

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

  const productosFiltrados = productos.filter((p) =>
    rubro === "" ? true : p.rubro?.toLowerCase().includes(rubro.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(
    indiceInicio,
    indiceInicio + itemsPorPagina
  );

  const generarPDF = async () => {
    const doc = new jsPDF();
    const itemsPorPagina = 100; // manejamos lógica por salto real, no por cantidad

    let x = 15;
    let y = 25;
    let count = 0;

    for (let i = 0; i < productosFiltrados.length; i++) {
      const producto = productosFiltrados[i];

      try {
        const url = `https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.cod_articulo}`;
        const dataUrl = await QRGenerator.toDataURL(url, {
          errorCorrectionLevel: "H",
          type: "image/png",
          width: 200,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // 🔺 Nombre del producto (centrado arriba)
        doc.setFontSize(10);
        const titulo = producto.articulo.slice(0, 35);
        const tituloWidth = doc.getTextWidth(titulo);
        doc.text(titulo, x + 25 - tituloWidth / 2, y - 4);

        // 🔲 QR
        doc.addImage(dataUrl, "PNG", x, y, 50, 50);

        // 🔻 Código del artículo (centrado abajo)
        doc.setFontSize(9);
        const codigo = producto.cod_articulo.toString();
        const codWidth = doc.getTextWidth(codigo);
        doc.text(codigo, x + 25 - codWidth / 2, y + 58);

        count++;
        x += 65;

        if (count % 3 === 0) {
          x = 15;
          y += 75; // más ajustado
        }

        // Verificamos si superamos el alto útil
        if (y + 75 > 280 || i === productosFiltrados.length - 1) {
          if (i !== productosFiltrados.length - 1) {
            doc.addPage();
            x = 15;
            y = 25;
          }
        }
      } catch (err) {
        console.error("Error generando QR:", err);
      }
    }

    doc.save(`qrs_${cliente}.pdf`);
  };

  return (
    <Container>
      <Header>
        <Title>Panel administrativo – {cliente}</Title>
        <LogoutButton onClick={() => signOut(getAuth())}>
          Cerrar sesión
        </LogoutButton>
      </Header>

      <FilterSection>
        <label>Filtrar por rubro:</label>
        <Input
          type="text"
          value={rubro}
          onChange={(e) => {
            setRubro(e.target.value);
            setPaginaActual(1);
          }}
          placeholder="Ej: lubricantes"
        />
        <GenerateButton onClick={generarPDF}>
          Descargar PDF con QRs
        </GenerateButton>
      </FilterSection>

      <QRGrid>
        {productosPaginados.map((producto) => (
          <QRCard key={producto.cod_articulo}>
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

      <Pagination>
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        Página {paginaActual} de {totalPaginas}
        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </Pagination>
    </Container>
  );
};

export default AdminPanel;
