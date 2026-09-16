// backend/controllers/authController.js
<<<<<<< HEAD
// Autenticación contra la tabla real `usuarios` de la base `mascotas`.
//
// Detalle importante: los 10 usuarios que ya venían en la base tienen
// la contraseña en texto plano ('pass1234'). Este controlador los deja
// entrar una última vez con esa clave y, en ese mismo login, la guarda
// como hash bcrypt. A partir de ahí nadie vuelve a tener la contraseña
// legible en la base.
=======
// Controlador: valida credenciales y responde en JSON para que
// el frontend (index.jsx) consuma este endpoint con fetch/axios.
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

<<<<<<< HEAD
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Un hash bcrypt siempre empieza por $2a$, $2b$ o $2y$.
const esHash = (valor) => typeof valor === 'string' && /^\$2[aby]\$/.test(valor);

// Del correo sale un usuario por defecto: carlos@mail.com -> carlos
function usernameDesdeCorreo(correo) {
  return String(correo).split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 40);
}

function sesionDe(usuario) {
  return {
    id: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    nombreCompleto: [usuario.nombre, usuario.apellido].filter(Boolean).join(' '),
    correo: usuario.correo,
    telefono: usuario.telefono,
    rol: usuario.rol
  };
}

const authController = {
  async registrar(req, res, next) {
    const { nombre, apellido = null, correo, password,
            telefono = null, username } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Completa nombre, correo y contraseña.' });
    }
    if (!CORREO_REGEX.test(correo)) {
      return res.status(400).json({ ok: false, mensaje: 'Ese correo no tiene un formato válido.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, mensaje: 'La contraseña necesita al menos 6 caracteres.' });
    }

    try {
      if (await Usuario.buscarPorCorreo(correo)) {
        return res.status(409).json({ ok: false, mensaje: 'Ya hay una cuenta con ese correo.' });
      }

      // La columna `username` es única: si el elegido ya existe, se le
      // agrega un número en vez de fallar con un error de MySQL.
      let usuarioFinal = (username || usernameDesdeCorreo(correo)) || 'usuario';
      let intento = 1;
      while (await Usuario.buscarPorUsername(usuarioFinal)) {
        usuarioFinal = `${(username || usernameDesdeCorreo(correo))}${intento++}`;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = await Usuario.crear({
        username: usuarioFinal,
        nombre,
        apellido,
        correo,
        telefono,
        passwordHash,
        rol: 'Cliente' // los roles de tu base son Cliente / Empleado / Admin
      });

      req.session.usuario = sesionDe({
        id, username: usuarioFinal, nombre, apellido, correo, telefono, rol: 'Cliente'
      });

      return res.status(201).json({
        ok: true,
        mensaje: 'Cuenta creada.',
        usuario: req.session.usuario
      });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    // La pantalla envía `correo`, pero se acepta también el username.
    const identificador = req.body.correo || req.body.usuario || req.body.username;
    const { password } = req.body;

    if (!identificador || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Escribe tu correo y tu contraseña.' });
    }

    try {
      const usuario = await Usuario.buscarPorIdentificador(identificador);
      if (!usuario || !usuario.password) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      let valida;
      if (esHash(usuario.password)) {
        valida = await bcrypt.compare(password, usuario.password);
      } else {
        // Contraseña heredada en texto plano: se compara tal cual y,
        // si acierta, se reemplaza por su hash en la misma petición.
        valida = password === usuario.password;
        if (valida) {
          await Usuario.actualizarPassword(usuario.id, await bcrypt.hash(password, 10));
        }
      }

      if (!valida) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      req.session.usuario = sesionDe(usuario);

      return res.json({
        ok: true,
        mensaje: 'Sesión iniciada.',
        usuario: req.session.usuario
      });
    } catch (err) {
      return next(err);
    }
  },

=======
const authController = {
  async login(req, res) {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Debes ingresar correo y contraseña.' });
    }

    try {
      const usuario = await Usuario.buscarPorCorreo(correo);

      if (!usuario) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);

      if (!passwordValida) {
        return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
      }

      // Guarda datos mínimos en sesión (cookie httpOnly)
      req.session.usuario = { id: usuario.id, nombre: usuario.nombre };

      return res.json({
        ok: true,
        mensaje: 'Sesión iniciada correctamente.',
        usuario: { id: usuario.id, nombre: usuario.nombre }
      });
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      return res.status(500).json({ ok: false, mensaje: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
    }
  },

  // Permite que el frontend, al cargar index.jsx, verifique si ya hay
  // una sesión activa (por ejemplo tras refrescar la página)
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
  sesionActual(req, res) {
    if (req.session.usuario) {
      return res.json({ ok: true, usuario: req.session.usuario });
    }
    return res.status(401).json({ ok: false, mensaje: 'No hay sesión activa.' });
  },

<<<<<<< HEAD
  // Perfil completo del usuario en sesión, leído de la base.
  async perfil(req, res, next) {
    try {
      const usuario = await Usuario.buscarPorId(req.session.usuario.id);
      if (!usuario) {
        return res.status(404).json({ ok: false, mensaje: 'La cuenta ya no existe.' });
      }
      res.json({ ok: true, usuario: sesionDe(usuario) });
    } catch (err) {
      next(err);
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.json({ ok: true, mensaje: 'Sesión cerrada.' }));
=======
  logout(req, res) {
    req.session.destroy(() => {
      res.json({ ok: true, mensaje: 'Sesión cerrada.' });
    });
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
  }
};

module.exports = authController;
