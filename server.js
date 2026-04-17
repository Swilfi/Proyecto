const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Pool de conexiones (maneja múltiples conexiones eficientemente)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Para usar async/await

// ---- RUTAS DE EJEMPLO (puedes agregar las que necesites) ----

// Obtener todos los estudiantes
app.get('/api/estudiantes', async (req, res) => {
    try {
    const [rows] = await pool.query(`
        SELECT e.*, r.nombre AS nombre_rep, r.apellido AS apellido_rep, r.cedula AS cedula_rep
        FROM estudiante e
        LEFT JOIN representante r ON e.id_representante_principal = r.id
    `);
    res.json(rows);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Crear un estudiante desde el registro de la aplicación
app.post('/api/estudiantes', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, cedula, direccion, cedula_representante } = req.body;

    try {
    let idRepresentante = null;
    if (cedula_representante) {
        const [rows] = await pool.query('SELECT id FROM representante WHERE cedula = ?', [cedula_representante]);
        if (rows.length === 0) {
        return res.status(400).json({ error: 'No existe un representante con esa cédula' });
        }
        idRepresentante = rows[0].id;
    }

    if (!cedula && !idRepresentante) {
        return res.status(400).json({ error: 'Debe ingresar cédula escolar o cédula de representante' });
    }

    const [result] = await pool.query(
        'INSERT INTO estudiante (nombre, apellido, fecha_nacimiento, cedula_escolar, direccion, id_representante_principal) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, fecha_nacimiento, cedula || null, direccion || null, idRepresentante]
    );

    res.status(201).json({ id: result.insertId, mensaje: 'Estudiante creado' });
    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'La cédula escolar ya existe' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al crear estudiante' });
    }
});

// Obtener todos los representantes
app.get('/api/representantes', async (req, res) => {
    try {
    const [rows] = await pool.query('SELECT * FROM representante');
    res.json(rows);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Crear un representante
app.post('/api/representantes', async (req, res) => {
    const { cedula, nombre, apellido, telefono, direccion } = req.body;

    try {
    const [result] = await pool.query(
        'INSERT INTO representante (cedula, nombre, apellido, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
        [cedula, nombre, apellido, telefono, direccion]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Representante creado' });
    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'La cédula ya está registrada' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al crear representante' });
    }
});

// Obtener todo el personal docente y administrativo
app.get('/api/profesores', async (req, res) => {
    try {
    const [rows] = await pool.query(`
        SELECT p.*, c.nombre AS cargo_nombre,
            g.id_grado AS grado_num,
            g.id_seccion AS seccion_num,
            g.año_escolar AS ano_escolar
        FROM personal p
        LEFT JOIN cargo c ON p.id_cargo = c.id
        LEFT JOIN grado_seccion g ON p.id_grado_seccion = g.id
    `);
    res.json(rows);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para ver estructura de tabla personal
app.get('/api/describe/personal', async (req, res) => {
    try {
        const [rows] = await pool.query('DESCRIBE personal');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener lista de cargos (para poblar un <select>)
app.get('/api/cargos', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM cargo');
    res.json(rows);
});

// Registrar profesor desde el registro de la aplicación
app.post('/api/profesores', async (req, res) => {
    const { nombre, apellido, cedula, telefono, email, cargo, grado, seccion } = req.body;
    console.log('POST /api/profesores body:', { nombre, apellido, cedula, telefono, email, cargo, grado, seccion });

    try {
    const [cargoRows] = await pool.query('SELECT id, nombre FROM cargo WHERE nombre = ?', [cargo]);
    console.log('cargoRows:', cargoRows);
    if (cargoRows.length === 0) {
        return res.status(400).json({ error: 'Cargo no válido' });
    }
    const idCargo = cargoRows[0].id;
    const isDocente = idCargo === 1 || String(cargo).toLowerCase().includes('docente');
    let idGradoSeccion = null;

    if (isDocente) {
        if (!grado || !seccion) {
        return res.status(400).json({ error: 'Un Docente debe tener asignado un Grado y Sección' });
        }

        const gradoNumber = parseInt(String(grado).replace(/\D/g, ''), 10);
        const seccionMap = { 'A': 1, 'B': 2, 'C': 3 };
        const seccionNumber = seccionMap[String(seccion).toUpperCase()] || null;

        if (!gradoNumber || !seccionNumber) {
        return res.status(400).json({ error: 'Grado o sección no válidos' });
        }

        const currentYear = new Date().getFullYear();
        const [gradoRows] = await pool.query(
        'SELECT id FROM grado_seccion WHERE id_grado = ? AND id_seccion = ? AND año_escolar = ?',
        [gradoNumber, seccionNumber, currentYear]
        );

        if (gradoRows.length > 0) {
        idGradoSeccion = gradoRows[0].id;
        } else {
        const [insertResult] = await pool.query(
            'INSERT INTO grado_seccion (id_grado, id_seccion, año_escolar) VALUES (?, ?, ?)',
            [gradoNumber, seccionNumber, currentYear]
        );
        idGradoSeccion = insertResult.insertId;
        }
    }

    console.log('idGradoSeccion:', idGradoSeccion);
    const [result] = await pool.query(
        'INSERT INTO personal (nombre, apellido, cedula, telefono, email, id_cargo, id_grado_seccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, cedula, telefono || null, email || null, idCargo, idGradoSeccion]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Profesor creado' });
    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'La cédula ya está registrada' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al registrar profesor' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));