import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #1f1f1f, #2c2c2c);
  min-height: 100vh;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductList = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: #3a3a3a;
  border-radius: 0.7rem;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const CodScanner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #f5f5f5;
`;

const Descripcion = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #f2eaac;
`;

const Transparencia = styled.div`
  font-size: 0.9rem;
  div {
    display: flex;
    justify-content: space-between;
    margin: 0.25rem 0;
  }
  span:first-child {
    color: #b8b8b8;
  }
  span:last-child {
    color: #c1c1c1;
  }
  .final-price {
    span {
      font-weight: bold;
      font-size: 1rem;
      color: #ffffff;
    }
  }
`;

const ProductName = styled.h3`
  margin-bottom: 0.5rem;
  color: #ffdd57;
  font-weight: 600;
  font-size: 1.1rem;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const BackButton = styled.button`
  background: #33749c;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
  &:hover {
    background: #225a75;
  }
`;

const CategoryView = () => {
  const { cliente, rubro } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(
          `/apies/${cliente.toLowerCase()}/products.json`
        );
        const data = await res.json();
        const filtrados = data.filter(
          (p) =>
            p.rubro?.toLowerCase() === decodeURIComponent(rubro.toLowerCase())
        );
        setProductos(filtrados);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [cliente, rubro]);

  return (
    <Container>
      <Title>Rubro: {decodeURIComponent(rubro)}</Title>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Cargando productos...
        </p>
      ) : productos.length > 0 ? (
        <ProductList>
          {productos
            .filter((p) => p.cod_lista_precio === "1")
            .map((p, index) => (
              <ProductCard key={`${p.cod_articulo}_${index}`}>
                <CodScanner>
                  <span>{p.cod_articulo}</span>
                  <span>{p.ean}</span>
                </CodScanner>
                <Descripcion>{p.articulo}</Descripcion>
                <Transparencia>
                  <div>
                    <span>Precio sin imp. nacionales:</span>
                    <span>${p.precio_neto}</span>
                  </div>
                  <div>
                    <span>Imp. internos: </span>
                    <span>${p.impuestos}</span>
                  </div>
                  <div>
                    <span>Iva: </span>
                    <span>${p.iva}</span>
                  </div>
                  <div>
                    <span>Precio por unidad:</span>
                    <span>
                      {p.volumen_x_unidad} ${p.precio_x_unidad}
                    </span>
                  </div>
                  <div className="final-price">
                    <span>Precio final:</span>
                    <span>${p.precio}</span>
                  </div>
                </Transparencia>
              </ProductCard>
            ))}
        </ProductList>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No se encontraron productos para este rubro.
        </p>
      )}
    </Container>
  );
};

export default CategoryView;
