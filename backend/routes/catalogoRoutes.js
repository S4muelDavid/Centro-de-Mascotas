// backend/routes/catalogoRoutes.js  ->  /api/productos
// Tablas: productos + inventarios + proveedores
const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', catalogoController.listar);
router.get('/proveedores', catalogoController.proveedores);
router.get('/:id', catalogoController.detalle);
router.patch('/:id/stock', requiereSesion, catalogoController.actualizarStock);

module.exports = router;
