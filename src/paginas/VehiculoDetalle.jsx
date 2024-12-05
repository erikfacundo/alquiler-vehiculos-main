// VehiculoDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VehiculoDetalle = () => {
  const { id } = useParams();  // Obtener el ID del vehículo de la URL
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    // Hacer una petición a la API para obtener los detalles del vehículo
    axios
      .get(`http://localhost:5000/api/vehiculos/${id}`)
      .then((response) => {
        setVehiculo(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del vehículo:", error);
      });
  }, [id]);

  if (!vehiculo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h2>{vehiculo.modelo}</h2>
      <img
        src={JSON.parse(vehiculo.imagenes)[0]}
        alt={vehiculo.modelo}
        className="img-fluid"
      />
      <p>{vehiculo.descripcion}</p>
      <p><strong>Precio:</strong> {vehiculo.precio}</p>
      <p><strong>Disponible:</strong> {vehiculo.disponible ? "Sí" : "No"}</p>
      {/* Agregar más detalles si es necesario */}
    </div>
  );
};

export default VehiculoDetalle;
