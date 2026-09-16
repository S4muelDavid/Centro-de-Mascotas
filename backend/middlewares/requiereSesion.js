// backend/middlewares/requiereSesion.js
// Protege rutas que solo debe usar un usuario autenticado.
// Úsalo así:  router.post('/', requiereSesion, controlador.crear);

module.exports = function requiereSesion(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Inicia sesión para continuar.'
    });
  }
  next();
};
