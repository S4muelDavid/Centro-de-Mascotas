// backend/routes/adopcionRoutes.js  ->  /api/adopciones   (tabla `adopciones`)
const express = require('express');
const router = express.Router();
const adopcionController = require('../controllers/adopcionController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', requiereSesion, adopcionController.listar);   // ?mias=1
router.get('/resumen', adopcionController.resumen);
router.post('/', requiereSesion, adopcionController.crear);

module.exports = router;
