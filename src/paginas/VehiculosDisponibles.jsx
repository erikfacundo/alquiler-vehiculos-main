// VehiculosDisponibles.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom"; // Importar Link para la navegación

const VehiculosDisponibles = () => {
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vehiculos")
      .then((response) => {
        setVehiculosDisponibles(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los vehículos:", error);
      });
  }, []);

  return (
    <div className="container">
      <Row>
        {vehiculosDisponibles.map((vehiculo) => (
          <Col md={4} key={vehiculo.id} className="mb-4">
            <Card>
              {!vehiculo.disponible && (
                <div className="position-absolute top-0 start-0 bg-danger text-white p-2">
                  Alquilado
                </div>
              )}
              <Card.Img
                variant="top"
                src={JSON.parse(vehiculo.imagenes)[0]}
                className="img-fluid"
              />
              <Card.Body>
                <Card.Title>{vehiculo.modelo}</Card.Title>
                <Card.Text>{vehiculo.descripcion}</Card.Text>
                <Link to={`/vehiculo/${vehiculo.id}`} className="btn btn-primary">
                  Ver Detalles
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VehiculosDisponibles;
