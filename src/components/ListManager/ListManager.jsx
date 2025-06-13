import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Container,
  Title,
  SearchInput,
  Button,
  DangerButton,
  ProductListContainer,
  ProductCard,
  Pagination,
  ListOptions,
  ListEdit,
  ListView,
} from "./ListManagerStyles";

const PAGE_SIZE = 30;

const ListManager = () => {
  const { estacion } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [listasGuardadas, setListasGuardadas] = useState({});
  const [nombreLista, setNombreLista] = useState("");

  // Fetch productos y listas guardadas
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`/apies/${estacion}/products.json`);
        const data = await response.json();
        const productosFiltrados = data.filter(
          (p) => String(p.cod_lista_precio) === "1"
        );
        setProductos(productosFiltrados);

        const listas =
          JSON.parse(localStorage.getItem("listasPredefinidas")) || {};
        setListasGuardadas(listas);

        const nombres = Object.keys(listas);
        if (nombres.length > 0) {
          const codigosGuardados = listas[nombres[0]].map(
            (p) => p.cod_articulo
          );
          const listaActualizada = productosFiltrados.filter((p) =>
            codigosGuardados.includes(p.cod_articulo)
          );
          setLista(listaActualizada);
          setNombreLista(nombres[0]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, [estacion]);

  // Funciones de gestión de la lista
  const agregarALista = (producto) => {
    if (
      !lista.find(
        (p) =>
          p.cod_articulo === producto.cod_articulo && p.ean === producto.ean
      )
    ) {
      const nuevaLista = [...lista, producto];
      setLista(nuevaLista);
      guardarEdicionLista(nuevaLista);
    }
  };

  const quitarDeLista = (codart) => {
    const nuevaLista = lista.filter((p) => p.cod_articulo !== codart);
    setLista(nuevaLista);
    guardarEdicionLista(nuevaLista);
  };

  const guardarEdicionLista = (nuevaLista) => {
    if (!nombreLista || !(nombreLista in listasGuardadas)) return;
    const codigos = nuevaLista.map((p) => ({ cod_articulo: p.cod_articulo }));
    const actualizadas = { ...listasGuardadas, [nombreLista]: codigos };
    setListasGuardadas(actualizadas);
    localStorage.setItem("listasPredefinidas", JSON.stringify(actualizadas));
  };

  const guardarLista = () => {
    if (!nombreLista.trim()) return;
    const codigos = lista.map((p) => ({ cod_articulo: p.cod_articulo }));
    const nuevasListas = { ...listasGuardadas, [nombreLista]: codigos };
    setListasGuardadas(nuevasListas);
    localStorage.setItem("listasPredefinidas", JSON.stringify(nuevasListas));
  };

  const cargarLista = (nombre) => {
    const codigos = listasGuardadas[nombre]?.map((p) => p.cod_articulo);
    if (codigos) {
      const productosFiltrados = productos.filter((p) =>
        codigos.includes(p.cod_articulo)
      );
      setLista(productosFiltrados);
      setNombreLista(nombre);
    }
  };

  const eliminarLista = (nombre) => {
    const nuevasListas = { ...listasGuardadas };
    delete nuevasListas[nombre];
    setListasGuardadas(nuevasListas);
    localStorage.setItem("listasPredefinidas", JSON.stringify(nuevasListas));
    if (nombre === nombreLista) {
      setLista([]);
      setNombreLista("");
    }
  };

  // Exportaciones
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
      `${p.volumen_x_unidad || ""} $${p.precio_x_unidad || "0"}`,
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
    worksheet.columns = [
      { header: "EAN", key: "ean", width: 20 },
      { header: "Producto", key: "producto", width: 40 },
      { header: "Precio S/imp. Nacionales", key: "precio_neto", width: 25 },
      { header: "Imp. Internos", key: "impuestos", width: 20 },
      { header: "Precio x/u", key: "precio_unidad", width: 20 },
      { header: "Final", key: "precio_final", width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3D3D3D" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" } };
    });

    lista.forEach((p, i) => {
      const row = worksheet.addRow({
        ean: p.ean || "0",
        producto: p.articulo || "",
        precio_neto: `$${parseFloat(p.precio_neto).toFixed(2)}`,
        impuestos: `$${parseFloat(p.impuestos).toFixed(2)}`,
        precio_unidad: `${p.precio_x_unidad || "1"}${
          p.volumen_x_unidad || "un"
        } $${parseFloat(p.precio_x_unidad || 0).toFixed(2)}`,
        precio_final: `$${parseFloat(p.precio).toFixed(2)}`,
      });
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF3F3F3" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.font = { size: 11 };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `lista_precios_${estacion}.xlsx`);
  };

  // Lógica de filtrado y paginación con useMemo
  const filteredProducts = useMemo(() => {
    return productos
      .filter((p) => p.articulo?.toLowerCase().includes(busqueda.toLowerCase()))
      .filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (p) =>
              `${p.cod_articulo}-${p.ean}` ===
              `${item.cod_articulo}-${item.ean}`
          )
      );
  }, [productos, busqueda]);

  const totalPaginas = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const start = (pagina - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, pagina]);

  return (
    <Container>
      <Button color="#33749c" onClick={() => navigate(-1)}>
        ← Volver atrás
      </Button>
      <Title>Armá tu lista de precios</Title>
      <SearchInput
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="product-list">
        <ProductListContainer>
          {paginatedProducts.map((producto) => (
            <ProductCard
              key={`${producto.cod_articulo}-${
                producto.ean || producto.descripcion || producto.id
              }`}
            >
              <h3>{producto.articulo}</h3>
              <p>Precio final: ${producto.precio}</p>
              <Button color="#22c55e" onClick={() => agregarALista(producto)}>
                Agregar
              </Button>
            </ProductCard>
          ))}
        </ProductListContainer>
      </div>
      <Pagination>
        <Button
          onClick={() => setPagina((prev) => prev - 1)}
          disabled={pagina === 1}
        >
          Anterior
        </Button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <Button
          onClick={() => setPagina((prev) => prev + 1)}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </Button>
      </Pagination>

      <ListOptions>
        {lista.length === 0 ? (
          <p>No hay productos en la lista.</p>
        ) : (
          <>
            <ListEdit>
              <Title style={{ marginTop: "4rem" }}>Lista armada</Title>
              <div>
                <input
                  type="text"
                  placeholder="Nombre de la lista"
                  value={nombreLista}
                  onChange={(e) => setNombreLista(e.target.value)}
                  style={{ padding: "0.5rem", marginRight: "1rem" }}
                />
                <Button onClick={guardarLista}>Guardar Lista</Button>
              </div>
              <ul>
                {lista.map((p) => (
                  <li
                    key={`${p.cod_articulo}-${p.ean || p.descripcion || p.id}`}
                  >
                    <span>
                      {p.cod_articulo} - {p.articulo} - ${p.precio}
                    </span>
                    <DangerButton onClick={() => quitarDeLista(p.cod_articulo)}>
                      Quitar
                    </DangerButton>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "1rem" }}>
                <Button onClick={exportarPDF}>Exportar PDF</Button>
                <Button color="#f59e0b" onClick={exportarXLSX}>
                  Exportar Excel
                </Button>
                <DangerButton
                  onClick={() => {
                    setLista([]);
                    if (nombreLista && listasGuardadas[nombreLista]) {
                      guardarEdicionLista([]);
                    }
                  }}
                >
                  Vaciar lista
                </DangerButton>
              </div>
            </ListEdit>

            <ListView>
              <Title style={{ marginTop: "4rem" }}>Listas guardadas</Title>
              <ul>
                {Object.keys(listasGuardadas).map((nombre) => (
                  <li key={nombre} style={{ marginBottom: "0.5rem" }}>
                    <strong>{nombre}</strong>{" "}
                    <div>
                      <Button
                        color="#10b981"
                        onClick={() => cargarLista(nombre)}
                      >
                        Cargar
                      </Button>{" "}
                      <DangerButton onClick={() => eliminarLista(nombre)}>
                        Eliminar
                      </DangerButton>
                    </div>
                  </li>
                ))}
              </ul>
            </ListView>
          </>
        )}
      </ListOptions>
    </Container>
  );
};

export default ListManager;
