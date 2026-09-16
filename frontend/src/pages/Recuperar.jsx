// src/pages/Recuperar.jsx
// Sección de recuperación de contraseña.
// Datos: POST /api/auth/recuperar  ->  tabla `usuarios`
//
// El proyecto no tiene un servicio de correo configurado, así que el
// usuario confirma su cuenta escribiendo el correo y define la nueva
// contraseña en el mismo formulario.

import { useState } from 'react';
import { authService } from '../services/authService.js';
import Huella from '../components/Huella.jsx';
import '../styles/auth.css';

export default function Recuperar({ onIrLogin }) {
  const [correo, setCorreo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);

    if (nuevaPassword !== confirmar) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }
    if (nuevaPassword.length < 6) {
      setError('La contraseña necesita al menos 6 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      await authService.recuperar(correo, nuevaPassword);
      setExito(true);
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
          <h2>Recupera tu contraseña</h2>

          {exito ? (
            <>
              <p className="auth-subtitulo">
                Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión con la nueva.
              </p>
              <button type="button" className="boton boton-primario auth-boton" onClick={onIrLogin}>
                Ir a iniciar sesión
              </button>
            </>
          ) : (
            <>
              <p className="auth-subtitulo">Escribe tu correo y define una nueva contraseña.</p>

              {error && <div className="aviso aviso-error" role="alert">{error}</div>}

              <form onSubmit={enviar}>
                <div className="campo">
                  <label htmlFor="correo-recuperar">Correo electrónico</label>
                  <input
                    id="correo-recuperar"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="password-recuperar">Nueva contraseña</label>
                  <input
                    id="password-recuperar"
                    type="password"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="confirmar-recuperar">Repite la contraseña</label>
                  <input
                    id="confirmar-recuperar"
                    type="password"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    placeholder="La misma de arriba"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button type="submit" className="boton boton-primario auth-boton" disabled={enviando}>
                  {enviando ? 'Actualizando…' : 'Actualizar contraseña'}
                </button>
              </form>
            </>
          )}

          <p className="auth-cambiar">
            ¿Ya la recordaste?{' '}
            <button type="button" className="auth-enlace" onClick={onIrLogin}>
              Vuelve a iniciar sesión
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
