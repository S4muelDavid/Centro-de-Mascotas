// backend/routes/mascotaRoutes.js  ->  /api/mascotas
// Tablas: mascotas + especies + razas + usuarios + adopciones
const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', mascotaController.listar);          // ?especie=perro&estado=disponible&limite=8
router.get('/resumen', mascotaController.resumen);
router.get('/especies', mascotaController.especies);
router.get('/razas', mascotaController.razas);      // ?especie=1
router.get('/:id', mascotaController.detalle);
router.post('/', requiereSesion, mascotaController.crear);
router.patch('/:id/estado', requiereSesion, mascotaController.cambiarEstado);
router.patch('/:id/salud', requiereSesion, mascotaController.cambiarSalud);

module.exports = router;
