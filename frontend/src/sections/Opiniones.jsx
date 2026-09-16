// src/sections/Opiniones.jsx
// Sección "Opiniones".
// Datos: GET /api/opiniones y POST /api/opiniones  ->  tabla `opiniones`
// Las opiniones nuevas se guardan con aprobado = 0 y solo aparecen
// cuando alguien del equipo las aprueba.

import { useState } from 'react';
import { opinionesService } from '../services/opinionesService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { OPINIONES_DEMO } from '../data/demo.js';
import Estrellas from '../components/Estrellas.jsx';
import { Cargando, AvisoDemo } from '../components/EstadoSeccion.jsx';
import '../styles/secciones/opiniones.css';

export default function Opiniones({ usuario }) {
  const { datos, cargando, origen, recargar } = useDatosSeccion(
    () => opinionesService.listar(),
    OPINIONES_DEMO
  );

  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState('');
  const [mascota, setMascota] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    setEnviando(true);

    try {
      const respuesta = await opinionesService.crear({
        texto,
        mascota: mascota || null,
        calificacion,
        nombre_autor: usuario?.nombre
      });
      setExito(respuesta.mensaje);
      setTexto('');
      setMascota('');
      setCalificacion(5);
      recargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const opiniones = datos?.opiniones || [];

  return (
    <section id="opiniones" className="seccion opiniones">
      <div className="contenedor">
        <div className="opiniones-encabezado">
          <div className="seccion-encabezado">
            <h2>Familias que ya adoptaron</h2>
            <p>
              Historias que nos escribieron después de llevarse a su mascota a casa.
            </p>
          </div>

          {datos?.promedio && (
            <div className="opiniones-promedio">
              <span className="promedio-numero">{datos.promedio}</span>
              <Estrellas valor={Math.round(Number(datos.promedio))} />
              <span className="promedio-total">
                {datos.total} {datos.total === 1 ? 'opinión' : 'opiniones'}
              </span>
            </div>
          )}
        </div>

        {cargando ? (
          <Cargando filas={3} alto={180} />
        ) : (
          <ul className="opiniones-lista">
            {opiniones.map((opinion) => (
              <li key={opinion.id} className="opinion">
                <Estrellas valor={opinion.calificacion} />
                <blockquote>{opinion.texto}</blockquote>
                <footer>
                  <span className="opinion-autor">{opinion.nombre_autor}</span>
                  {opinion.mascota && (
                    <span className="opinion-mascota">Adoptó a {opinion.mascota}</span>
                  )}
                </footer>
              </li>
            ))}
          </ul>
        )}

        {origen === 'demo' && <AvisoDemo tabla="opiniones" />}

        <div className="opiniones-aporte">
          {!abierto ? (
            <button type="button" className="boton boton-solido" onClick={() => setAbierto(true)}>
              Contar mi experiencia
            </button>
          ) : (
            <form className="opinion-formulario" onSubmit={enviar}>
              <h3>Cuéntanos cómo te fue</h3>

              {error && <div className="aviso aviso-error" role="alert">{error}</div>}
              {exito && <div className="aviso aviso-exito" role="status">{exito}</div>}

              <div className="campo">
                <label htmlFor="opinion-mascota">Mascota que adoptaste</label>
                <input
                  id="opinion-mascota"
                  value={mascota}
                  onChange={(e) => setMascota(e.target.value)}
                  placeholder="Nombre de la mascota"
                />
              </div>

              <div className="campo">
                <label htmlFor="opinion-texto">Tu experiencia</label>
                <textarea
                  id="opinion-texto"
                  rows={4}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Cómo fue el proceso y cómo está hoy tu mascota."
                  required
                />
              </div>

              <div className="campo">
                <span className="campo-etiqueta">Tu calificación</span>
                <Estrellas valor={calificacion} onCambio={setCalificacion} />
              </div>

              <div className="opinion-acciones">
                <button type="submit" className="boton boton-primario" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Publicar opinión'}
                </button>
                <button type="button" className="boton boton-contorno" onClick={() => setAbierto(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
