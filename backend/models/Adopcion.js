// backend/models/Adopcion.js
// Modelo de la tabla `adopciones`: el historial real de adopciones.
// Es la misma tabla que decide si una mascota aparece como disponible
// en el catálogo (ver models/Mascota.js).

const { pool } = require('../config/db');

const Adopcion = {
  async listar({ idUsuario, limite } = {}) {
    const valores = [];
    let sql = `
      SELECT a.id_adopcion  AS id,
             a.fecha_adopcion,
             a.estado,
             a.observaciones,
             a.created_at    AS creado_en,
             m.id_mascota,
             m.nombre        AS mascota,
             e.nombre        AS especie,
             r.nombre        AS raza,
             u.id            AS id_usuario,
             TRIM(CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, ''))) AS adoptante,
             u.correo        AS adoptante_correo
        FROM adopciones a
        INNER JOIN mascotas m ON m.id_mascota = a.id_mascota
        INNER JOIN especies e ON e.id_especie = m.id_especie
        INNER JOIN razas    r ON r.id_raza    = m.id_raza
        INNER JOIN usuarios u ON u.id         = a.id_usuario
    `;

    if (idUsuario) {
      sql += ' WHERE a.id_usuario = ?';
      valores.push(idUsuario);
    }
    sql += ' ORDER BY a.fecha_adopcion DESC, a.id_adopcion DESC';

    if (limite) {
      sql += ' LIMIT ?';
      valores.push(Number(limite));
    }

    const [filas] = await pool.query(sql, valores);
    return filas;
  },

  async resumen() {
    const [filas] = await pool.query(
      `SELECT estado, COUNT(*) AS total
         FROM adopciones
        GROUP BY estado`
    );
    return filas;
  },

  async crear({ id_mascota, id_usuario, estado = 'En Proceso', observaciones = null }) {
    const [resultado] = await pool.query(
      `INSERT INTO adopciones (id_mascota, id_usuario, fecha_adopcion, estado, observaciones)
       VALUES (?, ?, CURDATE(), ?, ?)`,
      [id_mascota, id_usuario, estado, observaciones]
    );
    return resultado.insertId;
  }
};

module.exports = Adopcion;
