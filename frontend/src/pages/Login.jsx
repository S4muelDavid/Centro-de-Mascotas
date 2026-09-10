// src/pages/Login.jsx
// Vista de login, conectada directamente al backend (POST /api/auth/login)

import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Login({ onLoginExitoso }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // permite que la cookie de sesión se guarde
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'No se pudo iniciar sesión.');
        return;
      }

      onLoginExitoso(data.usuario);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-panel-brand">
        <div className="brand-content">
          <div className="paw-icon">🐾</div>
          <h1>Huellitas</h1>
          <p>Centro de Adopción de Mascotas</p>
          <p className="brand-quote">
            "Cada huella cuenta una historia. Ayúdanos a encontrarle un hogar."
          </p>
        </div>
      </div>

      <div className="login-panel-form">
        <div className="form-wrapper">
          <h2>Bienvenido de nuevo</h2>
          <p className="subtitle">Inicia sesión para gestionar adopciones</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={manejarEnvio} className="login-form">
            <div className="input-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="tucorreo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" name="recordar" />
                Recordarme
              </label>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn-login" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="register-text">
            ¿Aún no tienes cuenta? <a href="#">Regístrate aquí</a>
          </p>
        </div>
      </div>

    </div>
  );
}
