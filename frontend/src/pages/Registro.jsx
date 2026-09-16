// src/pages/Registro.jsx
// Sección de registro.
// Datos: POST /api/auth/registro  ->  tabla `usuarios`

import { useState } from 'react';
import { authService } from '../services/authService.js';
import Huella from '../components/Huella.jsx';
import '../styles/auth.css';

function fuerzaPassword(password) {
  if (!password) return { nivel: 0, texto: '' };
  let puntos = 0;
  if (password.length >= 6) puntos += 1;
  if (password.length >= 10) puntos += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) puntos += 1;
  if (/\d/.test(password) || /[^\w]/.test(password)) puntos += 1;

  const textos = ['', 'Corta', 'Aceptable', 'Buena', 'Sólida'];
  return { nivel: puntos, texto: textos[puntos] };
}

export default function Registro({ onRegistroExitoso, onIrLogin }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const fuerza = fuerzaPassword(password);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmar) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña necesita al menos 6 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      const datos = await authService.registrar({ nombre, apellido, correo, telefono, password });
      onRegistroExitoso(datos.usuario);
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
            Con una cuenta puedes seguir a las mascotas que te interesan y
            registrar las que necesitan hogar.
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
          <h2>Crea tu cuenta</h2>
          <p className="auth-subtitulo">Toma menos de un minuto.</p>

          {error && <div className="aviso aviso-error" role="alert">{error}</div>}

          <form onSubmit={enviar}>
            <div className="campo-fila">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="correo-registro">Correo electrónico</label>
              <input
                id="correo-registro"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="telefono-registro">Teléfono</label>
              <input
                id="telefono-registro"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 000 0000"
                autoComplete="tel"
              />
            </div>

            <div className="campo">
              <label htmlFor="password-registro">Contraseña</label>
              <input
                id="password-registro"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                required
              />
              {password && (
                <div className="fuerza">
                  <div className="fuerza-barras" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={n <= fuerza.nivel ? `activa nivel-${fuerza.nivel}` : ''} />
                    ))}
                  </div>
                  <span className="fuerza-texto">{fuerza.texto}</span>
                </div>
              )}
            </div>

            <div className="campo">
              <label htmlFor="confirmar">Repite la contraseña</label>
              <input
                id="confirmar"
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="La misma de arriba"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="boton boton-primario auth-boton" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-cambiar">
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="auth-enlace" onClick={onIrLogin}>
              Entra aquí
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
