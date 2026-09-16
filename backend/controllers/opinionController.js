// backend/controllers/opinionController.js
// Controlador de la sección "Opiniones" (tabla `opiniones`).

const Opinion = require('../models/Opinion');

const opinionController = {
  async listar(req, res, next) {
    try {
      const [opiniones, resumen] = await Promise.all([
        Opinion.listar({ limite: req.query.limite }),
        Opinion.promedio()
      ]);
      res.json({
        ok: true,
        opiniones,
        promedio: resumen.promedio ? Number(resumen.promedio).toFixed(1) : null,
        total: resumen.total
      });
    } catch (err) {
      next(err);
    }
  },

  // Solo para el equipo: incluye las que todavía no están aprobadas.
  async pendientes(req, res, next) {
    try {
      const opiniones = await Opinion.listar({ soloAprobadas: false });
      res.json({ ok: true, opiniones: opiniones.filter((o) => !o.aprobado) });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    const { texto, calificacion } = req.body;

    if (!texto || texto.trim().length < 10) {
      return res.status(400).json({ ok: false, mensaje: 'Escribe al menos una frase sobre tu experiencia.' });
    }
    const puntaje = Number(calificacion);
    if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5) {
      return res.status(400).json({ ok: false, mensaje: 'La calificación va de 1 a 5.' });
    }

    try {
      const sesion = req.session.usuario;
      const id = await Opinion.crear({
        id_usuario: sesion.id,
        nombre_autor: req.body.nombre_autor || sesion.nombreCompleto || sesion.nombre,
        mascota: req.body.mascota || null,
        texto: texto.trim(),
        calificacion: puntaje
      });
      res.status(201).json({
        ok: true,
        id,
        mensaje: 'Gracias por contarnos. Tu opinión se publica cuando el equipo la revise.'
      });
    } catch (err) {
      next(err);
    }
  },

  async aprobar(req, res, next) {
    try {
      await Opinion.aprobar(req.params.id);
      res.json({ ok: true, mensaje: 'Opinión publicada.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = opinionController;
