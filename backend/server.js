// backend/server.js
<<<<<<< HEAD
// Punto de entrada del backend de Huellitas.
// Monta toda la API bajo /api (ver routes/index.js).
=======
// Punto de entrada del backend. Expone la API de autenticación en
// /api/auth/* para que el frontend React (src/index.jsx) la consuma.
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

<<<<<<< HEAD
const rutas = require('./routes');
const { probarConexion } = require('./config/db');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores');
=======
const authRoutes = require('./routes/authRoutes');
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
<<<<<<< HEAD
  credentials: true // la cookie de sesión debe poder viajar al frontend
=======
  credentials: true // necesario para que la cookie de sesión viaje al frontend
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
<<<<<<< HEAD
  name: 'huellitas.sid',
=======
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
  secret: process.env.SESSION_SECRET || 'huellitas_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
<<<<<<< HEAD
    maxAge: 1000 * 60 * 60 * 8, // 8 horas
    httpOnly: true,
    sameSite: 'lax',
    secure: false // ponlo en true cuando sirvas todo por HTTPS
  }
}));

app.use('/api', rutas);

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API de Huellitas. Los endpoints viven bajo /api.' });
});

app.use(rutaNoEncontrada);
app.use(manejarErrores);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`\n  Huellitas API  ->  http://localhost:${PORT}`);
  try {
    await probarConexion();
    console.log('  MySQL          ->  conectado\n');
  } catch (err) {
    console.log('  MySQL          ->  SIN CONEXIÓN');
    console.log(`  ${err.message}`);
    console.log('  Revisa el archivo .env y ejecuta database/schema.sql.');
    console.log('  El frontend seguirá funcionando con datos de ejemplo.\n');
  }
=======
    maxAge: 1000 * 60 * 60, // 1 hora
    sameSite: 'lax',
    secure: false // pon esto en true si sirves todo por HTTPS
  }
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de Huellitas corriendo correctamente.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend de Huellitas escuchando en http://localhost:${PORT}`);
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
});
