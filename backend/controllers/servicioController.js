// backend/controllers/servicioController.js
// Controlador de la sección "Servicios" (tabla `servicios`).

const Servicio = require('../models/Servicio');

const servicioController = {
  async listar(req, res, next) {
    try {
      const servicios = await Servicio.listar();
      res.json({ ok: true, total: servicios.length, servicios });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    const { titulo, descripcion } = req.body;
    if (!titulo || !descripcion) {
      return res.status(400).json({ ok: false, mensaje: 'El servicio necesita título y descripción.' });
    }
    try {
      const id = await Servicio.crear(req.body);
      res.status(201).json({ ok: true, id, mensaje: 'Servicio creado.' });
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const actualizado = await Servicio.actualizar(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ ok: false, mensaje: 'Ese servicio no existe.' });
      }
      res.json({ ok: true, mensaje: 'Servicio actualizado.' });
    } catch (err) {
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      await Servicio.eliminar(req.params.id);
      res.json({ ok: true, mensaje: 'Servicio retirado.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = servicioController;
