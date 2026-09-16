// src/index.jsx
// Punto de entrada del frontend.
// Aquí solo se cargan los estilos globales; cada sección importa el suyo.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
