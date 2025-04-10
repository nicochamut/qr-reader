import React from "react";
import { useParams } from "react-router-dom";

function AdminPanel() {
  // Se obtiene la estación de la URL
  const { estacion } = useParams();

  return (
    <div>
      <h1>Panel Administrativo - Estación {estacion}</h1>
      {/* Aquí se integrará la lógica de autenticación con Firebase y las funcionalidades administrativas */}
      <p>
        Bienvenido al panel administrativo. Aquí podrás gestionar los productos
        y ver estadísticas.
      </p>
    </div>
  );
}

export default AdminPanel;
