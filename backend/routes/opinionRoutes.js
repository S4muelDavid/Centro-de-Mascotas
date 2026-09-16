// backend/routes/opinionRoutes.js  ->  /api/opiniones   (tabla `opiniones`)
const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinionController');
const requiereSesion = require('../middlewares/requiereSesion');

router.get('/', opinionController.listar);
router.get('/pendientes', requiereSesion, opinionController.pendientes);
router.post('/', requiereSesion, opinionController.crear);
router.patch('/:id/aprobar', requiereSesion, opinionController.aprobar);

module.exports = router;
