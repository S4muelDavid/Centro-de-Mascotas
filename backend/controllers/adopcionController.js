// backend/controllers/adopcionController.js
// Controlador del historial de adopciones (tabla `adopciones`).

const Adopcion = require('../models/Adopcion');

const adopcionController = {
  async listar(req, res, next) {
    try {
      const adopciones = await Adopcion.listar({
        idUsuario: req.query.mias === '1' ? req.session.usuario.id : undefined,
        limite: req.query.limite
      });
      res.json({ ok: true, total: adopciones.length, adopciones });
    } catch (err) {
      next(err);
    }
  },

  async resumen(req, res, next) {
    try {
      const filas = await Adopcion.resumen();
      res.json({ ok: true, resumen: filas });
    } catch (err) {
      next(err);
    }
  },

  // Registrar interés en una mascota: crea la adopción en proceso.
  async crear(req, res, next) {
    const { id_mascota } = req.body;
    if (!id_mascota) {
      return res.status(400).json({ ok: false, mensaje: 'Indica qué mascota quieres adoptar.' });
    }
    try {
      const id = await Adopcion.crear({
        id_mascota,
        id_usuario: req.session.usuario.id,
        estado: 'En Proceso',
        observaciones: req.body.observaciones || 'Solicitud enviada desde la página web'
      });
      res.status(201).json({
        ok: true,
        id,
        mensaje: 'Registramos tu interés. El equipo te contacta para coordinar la visita.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adopcionController;
