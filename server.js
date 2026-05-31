const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', express.static(path.join(__dirname, 'Admindashboard')));

// Pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// ---- RUTAS DE ESTUDIANTES (GENERAL) ----

app.get('/api/estudiantes', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
        const grado = req.query.grado || null;
        const seccion = req.query.seccion || null;

        let query = `
            SELECT e.*, r.nombre AS nombre_rep, r.apellido AS apellido_rep, r.cedula AS cedula_rep
            FROM estudiante e
            LEFT JOIN representante r ON e.id_representante_principal = r.id
        `;
        const where = [];
        const params = [];
        if (grado) { where.push('e.grado = ?'); params.push(grado); }
        if (seccion) { where.push('e.seccion = ?'); params.push(seccion); }
        if (where.length) query += ' WHERE ' + where.join(' AND ');

        if (limit && limit > 0) {
            query += ' ORDER BY e.id DESC LIMIT ?';
            params.push(limit);
        } else {
            query += ' ORDER BY e.id DESC';
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        // Dev: devolver detalle para depuración local
        res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
    }
});

app.get('/api/estudiantes/count', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) AS count FROM estudiante');
        res.json(rows[0] || { count: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/estudiantes', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, cedula, direccion, cedula_representante, ano_escolar, grado, seccion } = req.body;
    try {
        let idRepresentante = null;
        if (cedula_representante) {
            const [rows] = await pool.query('SELECT id FROM representante WHERE cedula = ?', [cedula_representante]);
            if (rows.length === 0) return res.status(400).json({ error: 'No existe un representante con esa cédula' });
            idRepresentante = rows[0].id;
        }
        const [result] = await pool.query(
            'INSERT INTO estudiante (nombre, apellido, fecha_nacimiento, cedula_escolar, direccion, ano_escolar, grado, seccion, id_representante_principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, fecha_nacimiento || null, cedula || null, direccion || null, ano_escolar || null, grado || null, seccion || null, idRepresentante]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Estudiante creado' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'La cédula escolar ya existe' });
        console.error(error);
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
});

// ---- RUTAS DE REPRESENTANTES ----

app.get('/api/representantes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM representante');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/api/representantes', async (req, res) => {
    const { cedula, nombre, apellido, telefono, direccion } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO representante (cedula, nombre, apellido, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
            [cedula, nombre, apellido, telefono, direccion]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Representante creado' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'La cédula ya está registrada' });
        console.error(error);
        res.status(500).json({ error: 'Error al crear representante' });
    }
});

// ---- RUTAS DE PERSONAL/DOCENTES ----

app.get('/api/profesores', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, c.nombre AS cargo_nombre, g.id_grado AS grado_num, g.id_seccion AS seccion_num, g.año_escolar AS ano_escolar
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

app.get('/api/cargos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM cargo');
    res.json(rows);
});

app.post('/api/profesores', async (req, res) => {
    const { nombre, apellido, cedula, telefono, email, cargo, grado, seccion } = req.body;
    try {
        const [cargoRows] = await pool.query('SELECT id FROM cargo WHERE nombre = ?', [cargo]);
        if (cargoRows.length === 0) return res.status(400).json({ error: 'Cargo no válido' });
        const idCargo = cargoRows[0].id;
        const isDocente = idCargo === 1 || String(cargo).toLowerCase().includes('docente');
        let idGradoSeccion = null;

        if (isDocente) {
            const gradoNumber = parseInt(String(grado).replace(/\D/g, ''), 10);
            const seccionMap = { 'A': 1, 'B': 2, 'C': 3 };
            const seccionNumber = seccionMap[String(seccion).toUpperCase()] || null;
            const currentYear = new Date().getFullYear();
            const [gradoRows] = await pool.query(
                'SELECT id FROM grado_seccion WHERE id_grado = ? AND id_seccion = ? AND año_escolar = ?',
                [gradoNumber, seccionNumber, currentYear]
            );
            if (gradoRows.length > 0) idGradoSeccion = gradoRows[0].id;
            else {
                const [insertResult] = await pool.query('INSERT INTO grado_seccion (id_grado, id_seccion, año_escolar) VALUES (?, ?, ?)', [gradoNumber, seccionNumber, currentYear]);
                idGradoSeccion = insertResult.insertId;
            }
        }
        const [result] = await pool.query(
            'INSERT INTO personal (nombre, apellido, cedula, telefono, email, id_cargo, id_grado_seccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, cedula, telefono || null, email || null, idCargo, idGradoSeccion]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Profesor creado' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'La cédula ya está registrada' });
        console.error(error);
        res.status(500).json({ error: 'Error al registrar profesor' });
    }
});

// ==========================================
// RUTAS ESPECÍFICAS DE ASISTENCIA (MODIFICADAS)
// ==========================================

app.get('/api/obtener-estudiantes', async (req, res) => {
    const { ano_escolar, grado, seccion, fecha } = req.query;

    if (!grado || !seccion || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }

    try {
        const baseQuery = `
            SELECT 
                e.id, 
                e.nombre, 
                e.apellido,
                e.grado,
                e.seccion,
                (SELECT COUNT(*) FROM asistencias WHERE id_estudiante = e.id AND estado = 'Asistió') AS total_asistencias,
                (SELECT COUNT(*) FROM asistencias WHERE id_estudiante = e.id AND estado = 'Inasistente') AS total_inasistencias,
                (SELECT estado FROM asistencias WHERE id_estudiante = e.id AND fecha = ?) AS estado_hoy
            FROM estudiante e
            WHERE 1 = 1
              AND TRIM(LOWER(REPLACE(REPLACE(REPLACE(e.grado, ' ', ''), '°', ''), 'º', ''))) = TRIM(LOWER(REPLACE(REPLACE(REPLACE(?, ' ', ''), '°', ''), 'º', '')))
              AND TRIM(LOWER(e.seccion)) = TRIM(LOWER(?))
        `;

        let query = baseQuery;
        const params = [fecha, grado, seccion];

        if (ano_escolar) {
            query = query.replace('WHERE 1 = 1', `WHERE 1 = 1\n              AND (e.ano_escolar IS NULL OR e.ano_escolar = '' OR TRIM(LOWER(REPLACE(REPLACE(REPLACE(REPLACE(e.ano_escolar, ' ', ''), '-', ''), '/', ''), '.', ''))) = TRIM(LOWER(REPLACE(REPLACE(REPLACE(REPLACE(?, ' ', ''), '-', ''), '/', ''), '.', ''))))`);
            params.splice(1, 0, ano_escolar);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("DETALLE DEL ERROR SQL:", error);
        res.status(500).json({ error: 'Error al consultar la base de datos', detalle: error.message });
    }
});

app.post('/api/guardar-asistencia', async (req, res) => {
    const { fecha, registros } = req.body; 

    if (!fecha || !registros || registros.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const valores = registros.map(reg => [
            reg.id_estudiante, 
            fecha, 
            reg.estado_db, 
            reg.observaciones || null
        ]);

        const query = 'INSERT INTO asistencias (id_estudiante, fecha, estado, observaciones) VALUES ?';
        await pool.query(query, [valores]);

        res.json({ mensaje: 'Asistencia guardada con éxito' });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'ID de estudiante no válido' });
        console.error("Error al guardar asistencia:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar servidor
const PORT = 3000; // O el puerto que estés usando
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));