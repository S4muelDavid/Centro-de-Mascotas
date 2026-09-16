// backend/models/Servicio.js
// Modelo de la sección "Servicios", sobre la tabla real `servicios`:
//   id_servicio, nombre, icono, descripcion, precio, orden, activo
//
// La página habla de "titulo"; la base lo llama `nombre`. La traducción
// se hace aquí, en el SELECT, para no tocar los componentes.

const { pool } = require('../config/db');

const Servicio = {
  async listar() {
    const [filas] = await pool.query(
      `SELECT id_servicio AS id,
              icono,
              nombre      AS titulo,
              descripcion,
              precio,
              orden,
              created_at  AS creado_en
         FROM servicios
        WHERE activo = 1
        ORDER BY orden ASC, id_servicio ASC`
    );
    return filas;
  },

  async buscarPorId(id) {
    const [filas] = await pool.query(
      `SELECT id_servicio AS id, icono, nombre AS titulo, descripcion, precio, orden, activo
         FROM servicios
        WHERE id_servicio = ?
        LIMIT 1`,
      [id]
    );
    return filas[0] || null;
  },

  async crear({ icono = '🐾', titulo, descripcion, precio = 0, orden = 0 }) {
    const [resultado] = await pool.query(
      `INSERT INTO servicios (nombre, icono, descripcion, precio, orden, activo)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [titulo, icono, descripcion, precio, orden]
    );
    return resultado.insertId;
  },

  // Solo actualiza lo que llega: así un PUT parcial no borra el precio.
  async actualizar(id, { icono, titulo, descripcion, precio, orden }) {
    const actual = await Servicio.buscarPorId(id);
    if (!actual) return false;

    await pool.query(
      `UPDATE servicios
          SET nombre = ?, icono = ?, descripcion = ?, precio = ?, orden = ?
        WHERE id_servicio = ?`,
      [
        titulo ?? actual.titulo,
        icono ?? actual.icono,
        descripcion ?? actual.descripcion,
        precio ?? actual.precio,
        orden ?? actual.orden,
        id
      ]
    );
    return true;
  },

  // Retirar un servicio no borra la fila: la desactiva, para no perder
  // el histórico ni romper referencias.
  async eliminar(id) {
    await pool.query('UPDATE servicios SET activo = 0 WHERE id_servicio = ?', [id]);
  }
};

module.exports = Servicio;
