import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #616161, #3d3d3d);
  min-height: 100vh;
  color: white;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 25px;
`;

const ProductCard = styled.div`
  background: white;
  color: black;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 0.8rem;
  height: 2rem;
`;

const AddButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
`;

const ExportButton = styled.button`
  margin-top: 2rem;
  background: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    background: white;
    color: black;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const ListManager = () => {
  const { estacion } = useParams();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 30;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`/apies/${estacion}/products.json`);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, [estacion]);

  const agregarALista = (producto) => {
    if (!lista.find((p) => p.cod_articulo === producto.cod_articulo)) {
      setLista([...lista, producto]);
    }
  };

  const quitarDeLista = (codart) => {
    setLista(lista.filter((p) => p.cod_articulo !== codart));
  };

  const exportarPDF = () => {
    const doc = new jsPDF();

    const head = [
      [
        "EAN",
        "Producto",
        "Precio S/imp. Nacionales",
        "Imp. Internos",

        "Precio x/u",
        "Final",
      ],
    ];
    const body = lista.map((p) => [
      p.ean,
      p.articulo,
      `$${p.precio_neto}`,
      `$${p.impuestos}`,

      `${p.unidad || ""}${p.unidad_medida || ""} $${p.precio_x_unidad || "0"}`,
      `$${p.precio}`,
    ]);

    autoTable(doc, {
      head,
      body,
      styles: { halign: "center" },
      headStyles: { fillColor: [50, 50, 50] },
    });

    doc.save(`lista_precios_${estacion}.pdf`);
  };

  const exportarXLSX = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Lista de precios");

    // Definir columnas
    worksheet.columns = [
      { header: "EAN", key: "ean", width: 20 },
      { header: "Producto", key: "producto", width: 40 },
      { header: "Precio S/imp. Nacionales", key: "precio_neto", width: 25 },
      { header: "Imp. Internos", key: "impuestos", width: 20 },
      { header: "Precio x/u", key: "precio_unidad", width: 20 },
      { header: "Final", key: "precio_final", width: 15 },
    ];

    // Estilo del encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3D3D3D" }, // gris oscuro
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
      };
    });

    // Agregar filas con formato
    lista.forEach((p, i) => {
      const row = worksheet.addRow({
        ean: p.ean || "0",
        producto: p.articulo || "",
        precio_neto: `$${parseFloat(p.precio_neto).toFixed(2)}`,
        impuestos: `$${parseFloat(p.impuestos).toFixed(2)}`,
        precio_unidad: `${p.precio_x_unidad || "1"}${
          p.unidad_medida || "un"
        } $${parseFloat(p.precio_x_unidad || 0).toFixed(2)}`,
        precio_final: `$${parseFloat(p.precio).toFixed(2)}`,
      });

      // Alternar color de fondo para filas
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: i % 2 === 0 ? "FFFFFFFF" : "FFF3F3F3", // blanco y gris claro alternado
          },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.font = { size: 11 };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        };
      });
    });

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `lista_precios_${estacion}.xlsx`);
  };

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.articulo &&
      producto.articulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const productosPaginados = productosFiltrados.slice(
    inicio,
    inicio + porPagina
  );

  return (
    <Container>
      <ExportButton
        style={{ background: "#33749c", marginBottom: "1.5rem" }}
        onClick={() => navigate(-1)}
      >
        ← Volver atrás
      </ExportButton>
      <Title>Armá tu lista de precios</Title>
      <SearchInput
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <ProductList>
        {productosPaginados.map((producto) => (
          <ProductCard key={producto.cod_articulo}>
            <h3 className="font-semibold">{producto.articulo}</h3>
            <p className="font-bold">Precio final: ${producto.precio}</p>
            <AddButton onClick={() => agregarALista(producto)}>
              Agregar
            </AddButton>
          </ProductCard>
        ))}
      </ProductList>

      <Pagination>
        <button
          onClick={() => setPagina((prev) => prev - 1)}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span style={{ alignSelf: "center" }}>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((prev) => prev + 1)}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </button>
      </Pagination>

      <Title style={{ marginTop: "4rem" }}>Lista armada</Title>
      {lista.length === 0 ? (
        <p>No hay productos en la lista.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {lista.map((p) => (
              <li
                key={p.cod_articulo}
                className="flex justify-between items-center border p-2 rounded bg-white text-black mb-2"
              >
                <span>
                  {p.cod_articulo} - {p.articulo} - ${p.precio}
                </span>
                <RemoveButton onClick={() => quitarDeLista(p.cod_articulo)}>
                  Quitar
                </RemoveButton>
              </li>
            ))}
          </ul>

          <ExportButton onClick={exportarPDF} style={{ marginRight: "1rem" }}>
            Exportar PDF
          </ExportButton>
          <ExportButton
            onClick={exportarXLSX}
            style={{ backgroundColor: "#f59e0b" }}
          >
            Exportar Excel
          </ExportButton>
        </>
      )}
    </Container>
  );
};

export default ListManager;
