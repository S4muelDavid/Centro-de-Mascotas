// backend/server.js
// Punto de entrada del backend de Huellitas.
// Monta toda la API bajo /api (ver routes/index.js).

const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const rutas = require('./routes');
const { probarConexion } = require('./config/db');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // la cookie de sesión debe poder viajar al frontend
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'huellitas.sid',
  secret: process.env.SESSION_SECRET || 'huellitas_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
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
});
