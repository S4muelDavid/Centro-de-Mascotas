// backend/config/db.js
<<<<<<< HEAD
// Conexión a MySQL mediante un pool (mysql2/promise).
// Todos los modelos importan este pool: es el único punto del backend
// que sabe cómo se llega a la base de datos.
//
//   const { pool } = require('../config/db');
=======
// Conexión a MySQL usando un pool de conexiones (mysql2/promise)
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
<<<<<<< HEAD
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mascotas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4' // para que los acentos viajen bien
});

// Se usa al arrancar el servidor y en GET /api/health, para avisar
// con claridad si la base todavía no existe o las credenciales fallan.
async function probarConexion() {
  const conexion = await pool.getConnection();
  try {
    await conexion.query('SELECT 1');
    return true;
  } finally {
    conexion.release();
  }
}

module.exports = { pool, probarConexion };
=======
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'adopcion_huellitas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
