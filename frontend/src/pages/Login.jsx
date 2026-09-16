// src/pages/Login.jsx
<<<<<<< HEAD
// Sección de acceso.
// Datos: POST /api/auth/login  ->  tabla `usuarios`

import { useState } from 'react';
import { authService } from '../services/authService.js';
import Huella from '../components/Huella.jsx';
import '../styles/auth.css';

export default function Login({ onLoginExitoso, onIrRegistro }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
=======
// Vista de login, conectada directamente al backend (POST /api/auth/login)

import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Login({ onLoginExitoso }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e) => {
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
<<<<<<< HEAD
      const datos = await authService.login(correo, password);
      onLoginExitoso(datos.usuario);
    } catch (err) {
      setError(err.message);
=======
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
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
    } finally {
      setEnviando(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth">
      <section className="auth-marca">
        <div className="auth-marca-contenido">
          <Huella tamano={44} />
          <h1>Huellitas</h1>
          <p className="auth-lema">Centro de adopción de mascotas · Medellín</p>
          <blockquote className="auth-frase">
            Cada huella cuenta una historia. Ayúdanos a escribir el final.
          </blockquote>
        </div>
        <div className="auth-marca-huellas" aria-hidden="true">
          <Huella tamano={120} />
          <Huella tamano={80} />
          <Huella tamano={50} />
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-formulario">
          <h2>Entra a tu cuenta</h2>
          <p className="auth-subtitulo">Para gestionar adopciones y ver el catálogo completo.</p>

          {error && <div className="aviso aviso-error" role="alert">{error}</div>}

          <form onSubmit={enviar}>
            <div className="campo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="password">Contraseña</label>
              <div className="campo-password">
                <input
                  id="password"
                  type={verPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="ver-password"
                  onClick={() => setVerPassword((v) => !v)}
                >
                  {verPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <div className="auth-opciones">
              <label className="casilla">
                <input type="checkbox" name="recordar" />
                <span>Recordarme</span>
              </label>
              <a href="#recuperar" className="auth-enlace">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="boton boton-primario auth-boton" disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="auth-cambiar">
            ¿Todavía no tienes cuenta?{' '}
            <button type="button" className="auth-enlace" onClick={onIrRegistro}>
              Créala aquí
            </button>
          </p>
        </div>
      </section>
=======
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

>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
    </div>
  );
}
