// backend/routes/index.js
// Un solo lugar donde se registran todos los módulos de la API.
// Cada módulo apunta a tablas concretas de la base `mascotas`:
//
//   /api/auth        usuarios
//   /api/servicios   servicios
//   /api/mascotas    mascotas + especies + razas + adopciones + usuarios
//   /api/adopciones  adopciones
//   /api/productos   productos + inventarios + proveedores
//   /api/equipo      veterinarios + empleados
//   /api/solicitudes solicitudes_ingreso
//   /api/opiniones   opiniones

const express = require('express');
const router = express.Router();
const { pool, probarConexion } = require('../config/db');

router.use('/auth', require('./authRoutes'));
router.use('/servicios', require('./servicioRoutes'));
router.use('/mascotas', require('./mascotaRoutes'));
router.use('/adopciones', require('./adopcionRoutes'));
router.use('/productos', require('./catalogoRoutes'));
router.use('/equipo', require('./equipoRoutes'));
router.use('/solicitudes', require('./solicitudRoutes'));
router.use('/opiniones', require('./opinionRoutes'));

// El frontend lo consulta al arrancar para saber si la base responde.
// Además informa qué tablas ve, que es lo primero que uno quiere saber
// cuando algo no aparece en la página.
router.get('/health', async (req, res) => {
  try {
    await probarConexion();
    const [tablas] = await pool.query(
      `SELECT TABLE_NAME AS tabla, TABLE_ROWS AS filas
         FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME`
    );
    const [[bd]] = await pool.query('SELECT DATABASE() AS nombre');

    res.json({
      ok: true,
      api: 'arriba',
      baseDeDatos: 'conectada',
      nombre: bd.nombre,
      tablas: tablas.map((t) => t.tabla)
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      api: 'arriba',
      baseDeDatos: 'sin conexión',
      mensaje: err.message
    });
  }
});

module.exports = router;
