// backend/routes/solicitudRoutes.js  ->  /api/solicitudes
const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', requiereSesion, solicitudController.listar);
router.post('/', solicitudController.crear);   // abierto: cualquiera puede reportar una mascota
router.patch('/:id/estado', requiereSesion, solicitudController.cambiarEstado);

module.exports = router;
