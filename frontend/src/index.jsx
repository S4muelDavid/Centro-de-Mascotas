// src/index.jsx
<<<<<<< HEAD
// Punto de entrada del frontend.
// Aquí solo se cargan los estilos globales; cada sección importa el suyo.
=======
// Punto de entrada del frontend. Monta <App /> en el DOM.
// Este es el mismo index.jsx del proyecto original: ahora incluye
// el módulo de login conectado directamente al backend en /api/auth.
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
<<<<<<< HEAD
import './styles/tokens.css';
import './styles/app.css';
=======
import './styles/login.css';
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
