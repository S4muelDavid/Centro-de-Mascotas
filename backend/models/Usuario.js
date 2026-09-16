// backend/models/Usuario.js
// Modelo de usuarios sobre la tabla REAL `usuarios` de la base `mascotas`:
//   id, username, password, nombre, apellido, correo, telefono, role, created_at
//
// Dos detalles importantes de esa tabla:
//  - La columna del rol se llama `role` (no `rol`), así que aquí se
//    renombra a `rol` para que el resto de la app hable un solo idioma.
//  - Las contraseñas venían en texto plano. El login las acepta una
//    última vez y las reemplaza por un hash bcrypt (ver authController).

const { pool } = require('../config/db');

// Campos públicos: nunca incluyen la contraseña.
const CAMPOS = `id, username, nombre, apellido, correo, telefono,
                role AS rol, created_at AS creado_en`;

const Usuario = {
  // Sirve tanto para "correo" como para "usuario": la pantalla de login
  // acepta cualquiera de los dos.
  async buscarPorIdentificador(identificador) {
    const [filas] = await pool.query(
      `SELECT ${CAMPOS}, password
         FROM usuarios
        WHERE correo = ? OR username = ?
        LIMIT 1`,
      [identificador, identificador]
    );
    return filas[0] || null;
  },

  async buscarPorCorreo(correo) {
    const [filas] = await pool.query(
      `SELECT ${CAMPOS} FROM usuarios WHERE correo = ? LIMIT 1`,
      [correo]
    );
    return filas[0] || null;
  },

  async buscarPorUsername(username) {
    const [filas] = await pool.query(
      `SELECT ${CAMPOS} FROM usuarios WHERE username = ? LIMIT 1`,
      [username]
    );
    return filas[0] || null;
  },

  async buscarPorId(id) {
    const [filas] = await pool.query(
      `SELECT ${CAMPOS} FROM usuarios WHERE id = ? LIMIT 1`,
      [id]
    );
    return filas[0] || null;
  },

  async crear({ username, nombre, apellido = null, correo, telefono = null,
                passwordHash, rol = 'Cliente' }) {
    const [resultado] = await pool.query(
      `INSERT INTO usuarios
        (username, password, nombre, apellido, correo, telefono, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, passwordHash, nombre, apellido, correo, telefono, rol]
    );
    return resultado.insertId;
  },

  // Se usa para migrar en caliente las contraseñas de texto plano a bcrypt.
  async actualizarPassword(id, passwordHash) {
    await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [passwordHash, id]);
  },

  // Recuperación de contraseña: actualiza directamente por correo.
  async actualizarPasswordPorCorreo(correo, passwordHash) {
    const [resultado] = await pool.query(
      'UPDATE usuarios SET password = ? WHERE correo = ?',
      [passwordHash, correo]
    );
    return resultado.affectedRows > 0;
  }
};

module.exports = Usuario;
