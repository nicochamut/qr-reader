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
import { scanRegister } from "../utils/scanRegister";

const ProductDetails = ({ producto }) => {
  const [escanear, setEscanear] = useState(false);
  const {
    bandera,
    razon_social,
    cod_lista_precio,
    lista,
    cod_rubro,
    rubro,
    ean,
    cod_articulo,
    articulo,
    precio_x_unidad,
    volumen_x_unidad,
    precio_neto,
    impuestos,
    iva,
    precio,
    unidad,
    unidad_medida,
    ubicacion,
    precio_dolar,
    cotiz_dolar,
    fecha_cotiz_dolar,
  } = producto;

  const handleScanSuccess = (text) => {
    try {
      console.log("QR leído:", text);
      const url = new URL(text);
      const pathParts = url.pathname.split("/"); // ['', 'apies', '{cliente}', '{id}']
      const cliente = pathParts[2];
      const producto_id = pathParts[3];

      console.log("Cliente:", cliente);
      console.log("Producto ID extraído del QR:", producto_id);

      fetch(`/apies/${cliente}/products.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Archivo no encontrado");
          return res.json();
        })
        .then((productos) => {
          const producto = productos.find(
            (p) => p.cod_articulo === producto_id
          );

          if (!producto) {
            console.error("❌ Producto no encontrado");
            alert("Producto no encontrado");
            return;
          }

          console.log("✅ Producto encontrado:", producto);

          scanRegister({
            cliente,
            producto_id,
            descripcion: producto.articulo,
            rubro: producto.rubro || "",
            user_agent: navigator.userAgent,
            ip: "",
          });

          window.location.href = `/apies/${cliente}/${producto_id}`;
        })
        .catch((err) => {
          console.error("❌ Error cargando productos:", err);
          alert("Hubo un problema cargando la lista de productos.");
        });
    } catch (err) {
      alert("Código QR inválido");
    }
  };

  console.log(bandera);
  if (escanear) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Escaneá un nuevo producto</h2>
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setEscanear(false)}
        />
      </div>
    );
  }

  return (
    <Wrapper $bandera={bandera}>
      <Header>
        <Logo src={oleumlogo} alt="Grupo Oleum SRL" />
        <BanderaTag>
          <img
            src={
              bandera === "YPF"
                ? ypflogo
                : bandera === "shell"
                ? logoshell
                : fulllogo
            }
          />
        </BanderaTag>
      </Header>

      <Razon $bandera={bandera}>{razon_social}</Razon>
      <Main $bandera={bandera}>
        <Card>
          <CodScanner>
            <span>{cod_articulo}</span>
            <span>{ean}</span>
          </CodScanner>
          <Descripcion>{articulo}</Descripcion>
          <Transparencia>
            <div>
              <span>Precio neto:</span>
              <span>${precio_neto}</span>
            </div>
            <div>
              <span>Imp. internos: </span>
              <span>${impuestos}</span>
            </div>
            <div>
              <span>Iva: </span>
              <span>${iva}</span>
            </div>
            <div>
              <span>Precio por unidad:</span>
              <span>
                {unidad}
                {unidad_medida} ${precio_x_unidad}
              </span>
            </div>
          </Transparencia>
          <Precio>
            $
            {precio.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </Precio>
        </Card>

        <QRSection>
          <QRImage
            src={qrlogo}
            alt="QR code"
            onClick={() => setEscanear(true)}
          />
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
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: ${({ $bandera }) =>
    $bandera === "puma"
      ? "#007649"
      : $bandera === "YPF"
      ? "#0265BD"
      : $bandera === "shell"
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
  border-top: ${({ $bandera }) =>
    $bandera === "shell"
      ? "10px solid red"
      : $bandera === "YPF"
      ? "10px solid black"
      : "10px solid white"};
`;

const Logo = styled.img`
  padding-left: 0.1rem;
  width: 2.2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem;
`;

const Razon = styled.h2`
  text-align: center;
  color: ${({ $bandera }) => ($bandera === "shell" ? "#000000" : "#ffff")};
  font-size: 1.7rem;
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
    width: 4rem;
    border-radius: 5px;
  }
`;

const Card = styled.div`
  background: white;
  margin-top: 0;
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
  border-bottom: 1px solid #d5d5d5;
  padding-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Descripcion = styled.h2`
  font-size: 1.4rem;
  text-align: center;
  font-weight: 600;
`;

const Transparencia = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 0.9rem;

  padding-bottom: 6px;

  div {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid #d5d5d5;
  }
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
  margin-top: 1rem;
  gap: 0.1rem;
`;

const QRImage = styled.img`
  width: 6rem;
  margin-bottom: -5px;
  object-fit: contain;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.379);
`;

const Volver = styled.div`
  font-size: 0.85rem;
  background: linear-gradient(to bottom, #07ab72, #69e46d);
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.244);
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 1.5rem;

  font-size: 0.65rem;
  color: #333;
  text-align: center;
  opacity: 0;
  span {
    font-weight: bold;
  }
`;

export default ProductDetails;
