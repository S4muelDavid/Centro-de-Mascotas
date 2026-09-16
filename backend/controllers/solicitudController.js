// backend/controllers/solicitudController.js
// Controlador de la sección "Ingreso de mascotas"
// (tabla `solicitudes_ingreso`).

const Solicitud = require('../models/Solicitud');

const ESTADOS = ['pendiente', 'en_revision', 'aprobada', 'rechazada'];

const solicitudController = {
  async listar(req, res, next) {
    try {
      const solicitudes = await Solicitud.listar({ estado: req.query.estado });
      res.json({ ok: true, total: solicitudes.length, solicitudes });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    const { nombre_mascota, especie, descripcion, contacto_nombre, contacto_telefono } = req.body;

    if (!nombre_mascota || !especie || !descripcion) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Cuéntanos al menos el nombre, la especie y la historia de la mascota.'
      });
    }
    if (!contacto_nombre || !contacto_telefono) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Necesitamos un nombre y un teléfono para contactarte.'
      });
    }

    try {
      const id = await Solicitud.crear({
        ...req.body,
        id_usuario: req.session?.usuario?.id || null
      });
      res.status(201).json({
        ok: true,
        id,
        mensaje: 'Recibimos la solicitud. El equipo del refugio te escribe en los próximos días.'
      });
    } catch (err) {
      next(err);
    }
  },

  async cambiarEstado(req, res, next) {
    const { estado } = req.body;
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: `Estado inválido. Usa: ${ESTADOS.join(', ')}.` });
    }

    try {
      // Aprobar una solicitud la convierte en una mascota real del catálogo.
      if (estado === 'aprobada') {
        const idMascota = await Solicitud.aprobarEIngresar(req.params.id, req.session.usuario.id);
        if (!idMascota) {
          return res.status(404).json({ ok: false, mensaje: 'Esa solicitud no existe.' });
        }
        return res.json({
          ok: true,
          id_mascota: idMascota,
          mensaje: 'Solicitud aprobada. La mascota ya aparece en el catálogo.'
        });
      }

      await Solicitud.cambiarEstado(req.params.id, estado);
      res.json({ ok: true, mensaje: 'Solicitud actualizada.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = solicitudController;
