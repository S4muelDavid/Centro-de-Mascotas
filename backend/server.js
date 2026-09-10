// backend/server.js
// Punto de entrada del backend. Expone la API de autenticación en
// /api/auth/* para que el frontend React (src/index.jsx) la consuma.

const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // necesario para que la cookie de sesión viaje al frontend
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'huellitas_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
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
});
