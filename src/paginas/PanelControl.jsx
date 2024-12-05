import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";

const PanelControl = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/"); // Redirigir si no es admin
    } else {
      setUsuarioLogueado(currentUser);
    }

    // Obtener vehículos desde el servidor
    axios
      .get("http://localhost:5000/vehiculos")
      .then((response) => setVehiculos(response.data))
      .catch((error) => console.error("Error al obtener vehículos:", error));
  }, [navigate]);

  // Agregar un vehículo
  const agregarVehiculo = (nuevoVehiculo) => {
    axios
      .post("http://localhost:5000/vehiculos", nuevoVehiculo)
      .then((response) => {
        setVehiculos([...vehiculos, response.data]);
        alert("Vehículo agregado");
      })
      .catch((error) => {
        console.error("Error al agregar vehículo:", error);
        alert("Error al agregar vehículo");
      });
  };

  // Editar vehículo
  const handleEditClick = (vehiculo) => {
    setVehiculoEditar(vehiculo);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:5000/vehiculos/${vehiculoEditar.id}`, vehiculoEditar)
      .then((response) => {
        setVehiculos(
          vehiculos.map((vehiculo) =>
            vehiculo.id === vehiculoEditar.id ? response.data : vehiculo
          )
        );
        setShowModal(false);
        alert("Vehículo actualizado");
      })
      .catch((error) => {
        console.error("Error al actualizar vehículo:", error);
        alert("Error al actualizar vehículo");
      });
  };

  // Eliminar vehículo
  const eliminarVehiculo = (id) => {
    axios
      .delete(`http://localhost:5000/vehiculos/${id}`)
      .then(() => {
        setVehiculos(vehiculos.filter((vehiculo) => vehiculo.id !== id));
        alert("Vehículo eliminado");
      })
      .catch((error) => {
        console.error("Error al eliminar vehículo:", error);
        alert("Error al eliminar vehículo");
      });
  };

  // Cambiar disponibilidad
  const toggleDisponibilidad = (id) => {
    const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === id);
    const vehiculoActualizado = { ...vehiculo, disponible: !vehiculo.disponible };
    handleEditClick(vehiculoActualizado);
  };

  // Modificar un campo
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setVehiculoEditar((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      {usuarioLogueado && usuarioLogueado.isAdmin && (
        <>
          <h1 className="text-center">Panel de Control</h1>
          <p className="text-center">Vista solo para administradores.</p>

          {/* Botón para agregar un vehículo */}
          <button
            className="btn btn-primary mb-3"
            onClick={() =>
              agregarVehiculo({
                modelo: "Nuevo Modelo",
                marca: "Nueva Marca",
                descripcion: "Descripción del nuevo vehículo",
                costoPorHora: 10,
                potencia: "150 CV",
                consumo: "8.0 L/100km",
                comodidades: "Comodidad básica",
                pros: "Pros básicos",
                contras: "Contras básicos",
                disponible: true,
                imagenes: ["/src/assets/vehicles/default.png"],
              })
            }
          >
            Agregar Vehículo
          </button>

          {/* Tabla de vehículos */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td>{vehiculo.id}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.marca}</td>
                  <td>
                    {/* Switch para cambiar la disponibilidad */}
                    <Form.Check
                      type="switch"
                      id={`disponibilidad-switch-${vehiculo.id}`}
                      checked={vehiculo.disponible}
                      onChange={() => toggleDisponibilidad(vehiculo.id)}
                      label={vehiculo.disponible ? "Habilitado" : "Deshabilitado"}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(vehiculo)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminarVehiculo(vehiculo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal para editar vehículo */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Vehículo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="modelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={vehiculoEditar?.modelo || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="marca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="marca"
                    value={vehiculoEditar?.marca || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descripcion"
                    value={vehiculoEditar?.descripcion || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="costoPorHora">
                  <Form.Label>Costo por Hora</Form.Label>
                  <Form.Control
                    type="number"
                    name="costoPorHora"
                    value={vehiculoEditar?.costoPorHora || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="potencia">
                  <Form.Label>Potencia</Form.Label>
                  <Form.Control
                    type="text"
                    name="potencia"
                    value={vehiculoEditar?.potencia || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="consumo">
                  <Form.Label>Consumo</Form.Label>
                  <Form.Control
                    type="text"
                    name="consumo"
                    value={vehiculoEditar?.consumo || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="comodidades">
                  <Form.Label>Comodidades</Form.Label>
                  <Form.Control
                    type="text"
                    name="comodidades"
                    value={vehiculoEditar?.comodidades || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="pros">
                  <Form.Label>Pros</Form.Label>
                  <Form.Control
                    type="text"
                    name="pros"
                    value={vehiculoEditar?.pros || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group controlId="contras">
                  <Form.Label>Contras</Form.Label>
                  <Form.Control
                    type="text"
                    name="contras"
                    value={vehiculoEditar?.contras || ""}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveChanges}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default PanelControl;
