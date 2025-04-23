import React, { useState } from "react";

import styled from "styled-components";
import ypflogo from "../assets/ypflogo.png";
import pumalogo from "../assets/pumalogo.png";
import fulllogo from "../assets/fulllogo.webp";
import logoshell from "../assets/logoshell.png";
import oleumlogo from "../assets/oleumlogo.png";
import qrlogo from "../assets/qrlogo.png";
import retry from "../assets/retry.png";
import QrScanner from "./QrScanner";

const ProductDetails = ({ producto }) => {
  const [escanear, setEscanear] = useState(false);
  const {
    precio,
    preciosiniva,
    bandera,
    codscanner,
    descriart,
    razon,
    precioxcantidad,
  } = producto;

  const handleScanSuccess = (text) => {
    // Podés redirigir o buscar un producto por ID
    window.location.href = `/producto/${text}`;
  };

  if (escanear) {
    return (
      <div
        style={{ padding: "1rem", minHeight: "100vh", background: "#f4f4f4" }}
      >
        <h2 style={{ textAlign: "center" }}>Escaneá un nuevo producto</h2>
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setEscanear(false)}
        />
      </div>
    );
  }

  return (
    <Wrapper bandera={bandera}>
      <Header>
        <Logo src={oleumlogo} alt="Grupo Oleum SRL" />
        <BanderaTag>
          <img
            src={
              bandera === "ypf"
                ? ypflogo
                : bandera === "shell"
                ? logoshell
                : fulllogo
            }
          />
        </BanderaTag>
      </Header>

      <Razon bandera={bandera}>{razon}</Razon>
      <Main bandera={bandera}>
        <Card>
          <CodScanner>{codscanner}</CodScanner>
          <Descripcion>{descriart}</Descripcion>
          <Transparencia>
            <span>s/imp: ${preciosiniva}</span>
            <span>1lt: ${precioxcantidad}</span>
          </Transparencia>
          <Precio>
            $
            {precio.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Precio>
        </Card>

        <QRSection>
          <QRImage src={qrlogo} alt="QR code" />
          <Volver onClick={() => setEscanear(true)}>
            <img src={retry} /> Volver a escanear
          </Volver>
        </QRSection>
        <Footer>
          Developed by <span>@Fibotec</span>
        </Footer>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ bandera }) =>
    bandera === "puma"
      ? "#007649"
      : bandera === "ypf"
      ? "#0265BD"
      : bandera === "shell"
      ? "#FECB00"
      : "#979797"};
`;

const Main = styled.div`
  padding: 1.5rem 1rem;
  background: #dbdbdb;

  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  height: 75vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-top: ${({ bandera }) =>
    bandera === "shell"
      ? "10px solid red"
      : bandera === "ypf"
      ? "10px solid black"
      : "10px solid white"};
`;

const Logo = styled.img`
  padding-left: 1rem;
  width: 2.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem;
`;

const Razon = styled.h2`
  text-align: center;
  color: ${({ bandera }) => (bandera === "shell" ? "#000000" : "#ffff")};
  font-size: 2rem;
  margin-top: 0.7rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
`;

const BanderaTag = styled.div`
  border-radius: 1rem;

  img {
    width: 5rem;
  }
`;

const Card = styled.div`
  background: white;
  margin-top: 1.2rem;
  padding: 1.5rem 1.2rem;
  width: 90%;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.379);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CodScanner = styled.p`
  font-size: 0.9rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
`;

const Descripcion = styled.h2`
  font-size: 1.4rem;
  text-align: center;
  font-weight: 600;
`;

const Transparencia = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
`;

const Precio = styled.div`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
`;

const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  gap: 0.1rem;
`;

const QRImage = styled.img`
  width: 8rem;
  margin-bottom: -5px;
  object-fit: contain;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.379);
`;

const Volver = styled.div`
  font-size: 0.85rem;
  background: linear-gradient(to bottom, #07ab72, #69e46d);
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.379);
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 6rem;

  font-size: 0.75rem;
  color: #333;
  text-align: center;

  span {
    font-weight: bold;
  }
`;

export default ProductDetails;
