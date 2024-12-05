const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");  // Importamos bcrypt para la encriptación de contraseñas

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Cambia esto si tu usuario no es root
    password: "", // Agrega la contraseña si es necesaria
    database: "alquiler_vehiculos", // El nombre de tu base de datos
});

// Verifica la conexión
db.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

// Ruta para obtener los vehículos
app.get("/api/vehiculos", (req, res) => {
    const query = "SELECT * FROM vehiculos";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los datos:", err);
            res.status(500).send("Error al obtener los datos");
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
    const query = "SELECT id, nombre, email, rol, fecha_registro FROM usuarios";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los usuarios:", err);
            res.status(500).send("Error al obtener los usuarios");
        } else {
            res.json(results);  // Devolvemos los usuarios
        }
    });
});

// Ruta para registrar un nuevo usuario
app.post("/api/usuarios", (req, res) => {
    const { nombre, email, password, rol } = req.body;
    
    // Validamos que todos los campos sean proporcionados
    if (!nombre || !email || !password) {
        return res.status(400).send("Faltan datos requeridos");
    }

    // Encriptamos la contraseña antes de guardarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error al encriptar la contraseña:", err);
            return res.status(500).send("Error al encriptar la contraseña");
        }

        // Insertamos el nuevo usuario en la base de datos
        const query = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
        db.query(query, [nombre, email, hashedPassword, rol || 'cliente'], (err, results) => {
            if (err) {
                console.error("Error al registrar el usuario:", err);
                return res.status(500).send("Error al registrar el usuario");
            }
            res.status(201).send("Usuario registrado exitosamente");
        });
    });
});

// Inicia el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
