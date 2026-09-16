// backend/controllers/mascotaController.js
// Controlador de la sección "Mascotas en adopción".

const Mascota = require('../models/Mascota');

const mascotaController = {
  async listar(req, res, next) {
    const { especie, estado, limite } = req.query;
    try {
      const mascotas = await Mascota.listar({ especie, estado, limite });
      res.json({ ok: true, total: mascotas.length, mascotas });
    } catch (err) {
      next(err);
    }
  },

  async detalle(req, res, next) {
    try {
      const mascota = await Mascota.buscarPorId(req.params.id);
      if (!mascota) {
        return res.status(404).json({ ok: false, mensaje: 'Esa mascota ya no está en el catálogo.' });
      }
      res.json({ ok: true, mascota });
    } catch (err) {
      next(err);
    }
  },

  // Alimenta la pizarra del hero. Los tres estados se calculan
  // cruzando `mascotas` con `adopciones`.
  async resumen(req, res, next) {
    try {
      const filas = await Mascota.contarPorEstado();
      const resumen = filas.reduce((acumulado, fila) => {
        acumulado[fila.estado] = Number(fila.total);
        return acumulado;
      }, { disponible: 0, en_proceso: 0, adoptada: 0 });
      resumen.total = resumen.disponible + resumen.en_proceso + resumen.adoptada;
      res.json({ ok: true, resumen });
    } catch (err) {
      next(err);
    }
  },

  // Filtros de la sección: salen de la tabla `especies`, no de una
  // lista escrita a mano en el frontend.
  async especies(req, res, next) {
    try {
      const especies = await Mascota.listarEspecies();
      res.json({ ok: true, especies });
    } catch (err) {
      next(err);
    }
  },

  async razas(req, res, next) {
    try {
      const razas = await Mascota.listarRazas(req.query.especie);
      res.json({ ok: true, razas });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    const { nombre, especie } = req.body;
    if (!nombre || !especie) {
      return res.status(400).json({ ok: false, mensaje: 'La mascota necesita al menos nombre y especie.' });
    }
    try {
      const id = await Mascota.crear({ ...req.body, id_usuario: req.session.usuario.id });
      res.status(201).json({ ok: true, id, mensaje: 'Mascota publicada.' });
    } catch (err) {
      next(err);
    }
  },

  // Disponibilidad para adoptar: se escribe en la tabla `adopciones`.
  async cambiarEstado(req, res, next) {
    const { estado } = req.body;
    const permitidos = ['disponible', 'en_proceso', 'adoptada'];
    if (!permitidos.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: `Estado inválido. Usa: ${permitidos.join(', ')}.` });
    }
    try {
      const mascota = await Mascota.buscarPorId(req.params.id);
      if (!mascota) {
        return res.status(404).json({ ok: false, mensaje: 'Esa mascota no existe.' });
      }
      await Mascota.cambiarDisponibilidad(req.params.id, estado, req.session.usuario.id);
      res.json({ ok: true, mensaje: 'Estado de adopción actualizado.' });
    } catch (err) {
      next(err);
    }
  },

  // Estado de SALUD: se escribe en la columna `estado` de `mascotas`.
  async cambiarSalud(req, res, next) {
    const { estado_salud } = req.body;
    if (!estado_salud) {
      return res.status(400).json({ ok: false, mensaje: 'Indica el estado de salud.' });
    }
    try {
      await Mascota.cambiarEstadoSalud(req.params.id, estado_salud);
      res.json({ ok: true, mensaje: 'Estado de salud actualizado.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = mascotaController;
