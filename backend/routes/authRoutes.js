// backend/routes/authRoutes.js  ->  /api/auth   (tabla `usuarios`)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requiereSesion = require('../middlewares/requiereSesion');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.post('/recuperar', authController.recuperarPassword);
router.get('/sesion', authController.sesionActual);
router.get('/perfil', requiereSesion, authController.perfil);
router.post('/logout', authController.logout);

module.exports = router;
