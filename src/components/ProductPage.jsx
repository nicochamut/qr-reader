import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ProductDetails from "./ProductDetails";

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
          (item) => String(item.cod_articulo) === productId
        );
        setProducto(productoEncontrado);
        console.log(productoEncontrado);
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
    <ProductPageSt>
      <ProductDetails producto={producto} />
    </ProductPageSt>
  );
}

const ProductPageSt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  width: 100%;
`;

export default ProductPage;
