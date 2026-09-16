// backend/models/Equipo.js
// Modelo de la sección "Equipo": las dos tablas de personas de tu base
// que tampoco estaban conectadas a la página.
//
//   veterinarios  ->  quiénes atienden y en qué se especializan
//   empleados     ->  personal del centro, unido a `usuarios` por user_id
//
// De empleados NO se expone el salario: es dato interno y la página es
// pública para cualquiera con sesión iniciada.

const { pool } = require('../config/db');

const Equipo = {
  async listarVeterinarios() {
    const [filas] = await pool.query(
      `SELECT id_veterinario AS id,
              nombre,
              apellido,
              TRIM(CONCAT(nombre, ' ', COALESCE(apellido, ''))) AS nombre_completo,
              documento,
              telefono,
              correo,
              especialidad,
              created_at AS creado_en
         FROM veterinarios
        ORDER BY especialidad ASC, nombre ASC`
    );
    return filas;
  },

  async listarEmpleados({ soloActivos = true } = {}) {
    let sql = `SELECT e.id,
                      e.nombre,
                      e.apellido,
                      TRIM(CONCAT(e.nombre, ' ', COALESCE(e.apellido, ''))) AS nombre_completo,
                      e.telefono,
                      e.correo,
                      e.cargo,
                      e.status  AS estado,
                      e.user_id,
                      u.username,
                      u.role    AS rol,
                      e.created_at AS creado_en
                 FROM empleados e
            LEFT JOIN usuarios u ON u.id = e.user_id`;

    if (soloActivos) sql += " WHERE LOWER(e.status) = 'activo'";
    sql += ' ORDER BY e.cargo ASC, e.nombre ASC';

    const [filas] = await pool.query(sql);
    return filas;
  },

  async resumen() {
    const [[veterinarios]] = await pool.query(
      'SELECT COUNT(*) AS total, COUNT(DISTINCT especialidad) AS especialidades FROM veterinarios'
    );
    const [[empleados]] = await pool.query(
      "SELECT COUNT(*) AS total, SUM(LOWER(status) = 'activo') AS activos FROM empleados"
    );
    return { veterinarios, empleados };
  }
};

module.exports = Equipo;
