// backend/models/Opinion.js
// Modelo de la sección "Opiniones", sobre la tabla `opiniones`
// (creada por database/migracion_mascotas.sql).
// Solo se muestran las aprobadas (aprobado = 1).

const { pool } = require('../config/db');

const Opinion = {
  async listar({ soloAprobadas = true, limite } = {}) {
    let sql = `SELECT o.id_opinion  AS id,
                      o.nombre_autor,
                      COALESCE(m.nombre, o.mascota) AS mascota,
                      o.texto,
                      o.calificacion,
                      o.aprobado,
                      o.created_at  AS creado_en
                 FROM opiniones o
            LEFT JOIN mascotas m ON m.id_mascota = o.id_mascota`;
    const valores = [];

    if (soloAprobadas) sql += ' WHERE o.aprobado = 1';
    sql += ' ORDER BY o.created_at DESC, o.id_opinion DESC';

    if (limite) {
      sql += ' LIMIT ?';
      valores.push(Number(limite));
    }

    const [filas] = await pool.query(sql, valores);
    return filas;
  },

  async promedio() {
    const [filas] = await pool.query(
      `SELECT AVG(calificacion) AS promedio, COUNT(*) AS total
         FROM opiniones
        WHERE aprobado = 1`
    );
    return filas[0];
  },

  // Si el texto coincide con una mascota real de la base, se guarda
  // también su id: así la opinión queda enlazada a la ficha.
  async buscarIdMascotaPorNombre(nombre) {
    if (!nombre) return null;
    const [filas] = await pool.query(
      'SELECT id_mascota FROM mascotas WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
      [String(nombre).trim()]
    );
    return filas[0]?.id_mascota || null;
  },

  async crear({ id_usuario = null, nombre_autor, mascota = null, texto, calificacion = 5 }) {
    const idMascota = await Opinion.buscarIdMascotaPorNombre(mascota);

    const [resultado] = await pool.query(
      `INSERT INTO opiniones
        (id_usuario, id_mascota, nombre_autor, mascota, texto, calificacion, aprobado)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [id_usuario, idMascota, nombre_autor, mascota, texto, calificacion]
    );
    return resultado.insertId;
  },

  async aprobar(id) {
    await pool.query('UPDATE opiniones SET aprobado = 1 WHERE id_opinion = ?', [id]);
  },

  async eliminar(id) {
    await pool.query('DELETE FROM opiniones WHERE id_opinion = ?', [id]);
  }
};

module.exports = Opinion;
