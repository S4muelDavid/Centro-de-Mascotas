// backend/models/Usuario.js
// Modelo: encapsula todo el acceso a datos relacionado con usuarios

const pool = require('../config/db');

const Usuario = {
  async buscarPorCorreo(correo) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );
    return rows[0] || null;
  },

  async crear({ nombre, correo, passwordHash }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, passwordHash]
    );
    return result.insertId;
  }
};

module.exports = Usuario;
