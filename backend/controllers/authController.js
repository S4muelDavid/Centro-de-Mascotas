// backend/controllers/authController.js
// Controlador: valida credenciales y responde en JSON para que
// el frontend (index.jsx) consuma este endpoint con fetch/axios.

const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const authController = {
  async login(req, res) {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Debes ingresar correo y contraseña.' });
    }

    try {
      const usuario = await Usuario.buscarPorCorreo(correo);

      if (!usuario) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);

      if (!passwordValida) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      // Guarda datos mínimos en sesión (cookie httpOnly)
      req.session.usuario = { id: usuario.id, nombre: usuario.nombre };

      return res.json({
        ok: true,
        mensaje: 'Sesión iniciada correctamente.',
        usuario: { id: usuario.id, nombre: usuario.nombre }
      });
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      return res.status(500).json({ ok: false, mensaje: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
    }
  },

  // Permite que el frontend, al cargar index.jsx, verifique si ya hay
  // una sesión activa (por ejemplo tras refrescar la página)
  sesionActual(req, res) {
    if (req.session.usuario) {
      return res.json({ ok: true, usuario: req.session.usuario });
    }
    return res.status(401).json({ ok: false, mensaje: 'No hay sesión activa.' });
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.json({ ok: true, mensaje: 'Sesión cerrada.' });
    });
  }
};

module.exports = authController;
