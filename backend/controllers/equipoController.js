// backend/controllers/equipoController.js
// Controlador de la sección "Equipo": veterinarios y empleados.

const Equipo = require('../models/Equipo');

const equipoController = {
  async listar(req, res, next) {
    try {
      const [veterinarios, empleados, resumen] = await Promise.all([
        Equipo.listarVeterinarios(),
        Equipo.listarEmpleados({ soloActivos: req.query.todos !== '1' }),
        Equipo.resumen()
      ]);
      res.json({ ok: true, veterinarios, empleados, resumen });
    } catch (err) {
      next(err);
    }
  },

  async veterinarios(req, res, next) {
    try {
      const veterinarios = await Equipo.listarVeterinarios();
      res.json({ ok: true, total: veterinarios.length, veterinarios });
    } catch (err) {
      next(err);
    }
  },

  async empleados(req, res, next) {
    try {
      const empleados = await Equipo.listarEmpleados({ soloActivos: req.query.todos !== '1' });
      res.json({ ok: true, total: empleados.length, empleados });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = equipoController;
