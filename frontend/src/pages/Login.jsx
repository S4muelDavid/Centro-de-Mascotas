// src/pages/Login.jsx
// Sección de acceso.
// Datos: POST /api/auth/login  ->  tabla `usuarios`

import { useState } from 'react';
import { authService } from '../services/authService.js';
import Huella from '../components/Huella.jsx';
import '../styles/auth.css';

export default function Login({ onLoginExitoso, onIrRegistro, onIrRecuperar }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const datos = await authService.login(correo, password);
      onLoginExitoso(datos.usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
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
              <button type="button" className="auth-enlace" onClick={onIrRecuperar}>
                ¿Olvidaste tu contraseña?
              </button>
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
    </div>
  );
}
