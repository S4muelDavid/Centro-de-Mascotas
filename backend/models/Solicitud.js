// backend/models/Solicitud.js
// Modelo de la sección "Ingreso de mascotas", sobre la tabla
// `solicitudes_ingreso` (creada por database/migracion_mascotas.sql).
//
// Cuando alguien quiere entregar una mascota, la solicitud queda aquí
// con estado 'pendiente' hasta que el equipo la revisa. Al aprobarla,
// `aprobarEIngresar` la convierte en una fila real de `mascotas`.

const { pool } = require('../config/db');
const Mascota = require('./Mascota');

const Solicitud = {
  async listar({ estado } = {}) {
    let sql = `SELECT s.id_solicitud AS id,
                      s.id_usuario,
                      s.nombre_mascota,
                      s.especie,
                      s.edad_aproximada,
                      s.descripcion,
                      s.contacto_nombre,
                      s.contacto_telefono,
                      s.contacto_correo,
                      s.estado,
                      s.created_at   AS creado_en,
                      TRIM(CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, ''))) AS solicitante
                 FROM solicitudes_ingreso s
            LEFT JOIN usuarios u ON u.id = s.id_usuario`;
    const valores = [];

    if (estado) {
      sql += ' WHERE s.estado = ?';
      valores.push(estado);
    }
    sql += ' ORDER BY s.created_at DESC, s.id_solicitud DESC';

    const [filas] = await pool.query(sql, valores);
    return filas;
  },

  async buscarPorId(id) {
    const [filas] = await pool.query(
      'SELECT * FROM solicitudes_ingreso WHERE id_solicitud = ? LIMIT 1',
      [id]
    );
    return filas[0] || null;
  },

  async crear(datos) {
    const {
      id_usuario = null, nombre_mascota, especie = 'Perro',
      edad_aproximada = null, descripcion,
      contacto_nombre, contacto_telefono, contacto_correo = null
    } = datos;

    const [resultado] = await pool.query(
      `INSERT INTO solicitudes_ingreso
        (id_usuario, nombre_mascota, especie, edad_aproximada, descripcion,
         contacto_nombre, contacto_telefono, contacto_correo, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [id_usuario, nombre_mascota, especie, edad_aproximada, descripcion,
       contacto_nombre, contacto_telefono, contacto_correo]
    );
    return resultado.insertId;
  },

  async cambiarEstado(id, estado) {
    await pool.query(
      'UPDATE solicitudes_ingreso SET estado = ? WHERE id_solicitud = ?',
      [estado, id]
    );
  },

  // Aprobar una solicitud la pasa al catálogo: crea la mascota en la
  // tabla `mascotas` (resolviendo especie y raza) y deja la solicitud
  // marcada como aprobada.
  async aprobarEIngresar(id, idUsuarioResponsable) {
    const solicitud = await Solicitud.buscarPorId(id);
    if (!solicitud) return null;

    const idMascota = await Mascota.crear({
      nombre: solicitud.nombre_mascota,
      especie: solicitud.especie,
      raza: 'Sin determinar',
      descripcion: solicitud.descripcion,
      estado_salud: 'Saludable',
      id_usuario: solicitud.id_usuario || idUsuarioResponsable
    });

    await Solicitud.cambiarEstado(id, 'aprobada');
    return idMascota;
  }
};

module.exports = Solicitud;
