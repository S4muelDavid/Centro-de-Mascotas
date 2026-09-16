// backend/routes/equipoRoutes.js  ->  /api/equipo
// Tablas: veterinarios + empleados (+ usuarios)
const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

router.get('/', equipoController.listar);
router.get('/veterinarios', equipoController.veterinarios);
router.get('/empleados', equipoController.empleados);

module.exports = router;
