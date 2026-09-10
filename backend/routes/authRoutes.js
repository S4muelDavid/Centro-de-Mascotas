// backend/routes/authRoutes.js
// Rutas del módulo de autenticación, consumidas por el frontend React

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/sesion', authController.sesionActual);
router.post('/logout', authController.logout);

module.exports = router;
