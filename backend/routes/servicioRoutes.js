// backend/routes/servicioRoutes.js  ->  /api/servicios
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', servicioController.listar);
router.post('/', requiereSesion, servicioController.crear);
router.put('/:id', requiereSesion, servicioController.actualizar);
router.delete('/:id', requiereSesion, servicioController.eliminar);

module.exports = router;
