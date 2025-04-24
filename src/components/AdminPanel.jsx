import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #0b0b0b, #3d3d3d);
  height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  font-size: 0.875rem;
  color: red;
  background: none;
  border: none;
  cursor: pointer;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const QRCard = styled.div`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
  text-align: center;
`;

const AdminPanel = () => {
  const { cliente } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]);
  const [rubro, setRubro] = useState("");
  const qrRef = useRef();

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

  const generarPDF = async () => {
    const doc = new jsPDF();
    const qrElement = qrRef.current;

    try {
      const canvas = await html2canvas(qrElement);
      const imgData = canvas.toDataURL("image/png");

      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save(`qrs_${cliente}.pdf`);
    } catch (err) {
      console.error("Error al generar el PDF con QRs:", err);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    rubro === "" ? true : p.rubro?.toLowerCase().includes(rubro.toLowerCase())
  );

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
          onChange={(e) => setRubro(e.target.value)}
          placeholder="Ej: lubricantes"
        />
        <GenerateButton onClick={generarPDF}>
          Descargar PDF con QRs
        </GenerateButton>
      </FilterSection>

      <QRGrid ref={qrRef}>
        {productosFiltrados.map((producto) => (
          <QRCard key={producto.id}>
            <h3>{producto.descriart}</h3>

            <QRCode
              value={`https://qr-reader-blue.vercel.app/apies/${cliente}/${producto.id}`}
              size={170}
            />
            <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
              {producto.id}
            </p>
          </QRCard>
        ))}
      </QRGrid>
    </Container>
  );
};

export default AdminPanel;
