<<<<<<< HEAD
// backend/routes/authRoutes.js  ->  /api/auth   (tabla `usuarios`)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requiereSesion = require('../middlewares/requiereSesion');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/sesion', authController.sesionActual);
router.get('/perfil', requiereSesion, authController.perfil);
=======
// backend/routes/authRoutes.js
// Rutas del módulo de autenticación, consumidas por el frontend React

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/sesion', authController.sesionActual);
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
router.post('/logout', authController.logout);

module.exports = router;
