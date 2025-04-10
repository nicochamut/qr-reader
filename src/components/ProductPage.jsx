import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ypflogo from "../assets/ypflogo.png";
import oleumlogo from "../assets/oleumlogo.png";
import fulllogo from "../assets/fulllogo.webp";

function ProductPage() {
  // Se extraen los parámetros de la URL: cliente (por ejemplo "ORLANDO") y productId.
  const { cliente, productId } = useParams();

  // Estados para manejar el producto, la carga y posibles errores.
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Se construye la URL para obtener el JSON del cliente.
    const url = `/apies/${cliente}/products.json`;

    setCargando(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener datos del servidor");
        }
        return response.json();
      })
      .then((data) => {
        // Se asume que el JSON es un array de productos.
        // Se busca el producto cuyo id coincida con el productId de la URL.
        const productoEncontrado = data.find(
          (item) => String(item.id) === productId
        );
        setProducto(productoEncontrado);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [cliente, productId]);

  // Manejo de los distintos estados de la aplicación.
  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!producto) return <div>Producto no encontrado.</div>;

  return (
    <Main>
      <Title>
        <h2>Orlando Fernandez SRL</h2>
        <img src={ypflogo} />
      </Title>
      <Card>
        <ProductDetails>
          <div className="codscanner">
            <p>{producto.codscanner}</p>
            <img className="fulllogo" src={fulllogo} />
          </div>
          <div className="descriart">
            <h2>{producto.descriart}</h2>
          </div>
          <div className="transparencia">
            {" "}
            <p>s/imp: ${producto.preciosiniva}</p>
            <p>1lt: ${producto.precioxcantidad}</p>
          </div>
          <div className="precio">
            <h2>${producto.precio}</h2>
          </div>
        </ProductDetails>
        <Signature>
          <div className="oleum">
            <img src={oleumlogo} />
            <h3>Grupo Oleum SRL</h3>
          </div>
          <div className="fibotec">
            <p>
              Developed by <span>@Fibotec</span>
            </p>
          </div>
        </Signature>
      </Card>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #0265bd;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.3rem;

  margin: 1.4rem;
  color: white;
  img {
    border-radius: 15px;
  }
`;

const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: white;
  width: 100%;
  height: 80vh;
  border-radius: 35px 35px 0px 0px;
`;

const ProductDetails = styled.div`
  padding: 20px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 3px 4px 8px #272727b4;
  background: white;
  border-radius: 15px;
  margin-bottom: 20rem;
  .codscanner {
    position: relative;

    width: 90%;
    display: flex;

    p {
      margin-bottom: 3px;
      padding-bottom: 2px;
      border-bottom: 1px solid #000000a6;
      width: 80%;
    }

    .fulllogo {
      position: absolute;
      top: -19px;
      right: -42px;
      width: 7rem;
    }
  }
  .transparencia {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid #000000a6;
    width: 90%;
  }
  .descriart {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.5rem;
    margin-top: 20px;

    margin-bottom: -2rem;
  }
  .precio {
    font-size: 3rem;

    h2 {
      margin: 5px;
    }
  }
`;

const Signature = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  position: absolute;
  bottom: 0px;
  height: 16rem;
  .oleum {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    img {
      width: 6rem;
    }
  }

  .fibotec {
  }
`;

export default ProductPage;
