// backend/middlewares/manejarErrores.js
// Captura cualquier error que escape de los controladores y responde
// siempre en JSON, para que el frontend nunca reciba una página HTML.

function rutaNoEncontrada(req, res) {
  res.status(404).json({ ok: false, mensaje: `La ruta ${req.originalUrl} no existe.` });
}

function manejarErrores(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err);

  // Errores típicos de MySQL cuando la base aún no está lista
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({
      ok: false,
      mensaje: 'La tabla consultada no existe. Ejecuta database/schema.sql en MySQL.'
    });
  }
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      ok: false,
      mensaje: 'MySQL no responde. Revisa que el servidor esté corriendo y el puerto del archivo .env.'
    });
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      ok: false,
      mensaje: 'MySQL rechazó el usuario o la contraseña. Corrige DB_USER y DB_PASSWORD en el archivo .env.'
    });
  }
  if (err.code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({
      ok: false,
      mensaje: 'La base de datos no existe. Ejecuta database/schema.sql en MySQL.'
    });
  }

  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.mensaje || 'Ocurrió un error en el servidor. Intenta de nuevo.'
  });
}

module.exports = { rutaNoEncontrada, manejarErrores };
