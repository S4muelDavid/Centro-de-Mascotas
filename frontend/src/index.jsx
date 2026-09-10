// src/index.jsx
// Punto de entrada del frontend. Monta <App /> en el DOM.
// Este es el mismo index.jsx del proyecto original: ahora incluye
// el módulo de login conectado directamente al backend en /api/auth.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/login.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
