// src/sections/Equipo.jsx
// Sección "Equipo". Datos: GET /api/equipo
// Tablas: veterinarios + empleados (unida a usuarios por user_id)

import { equipoService } from '../services/equipoService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { EQUIPO_DEMO } from '../data/demo.js';
import { Cargando, AvisoDemo } from '../components/EstadoSeccion.jsx';
import '../styles/secciones/equipo.css';

function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function Equipo() {
  const { datos, cargando, origen } = useDatosSeccion(
    () => equipoService.listar(),
    EQUIPO_DEMO
  );

  const veterinarios = datos?.veterinarios || [];
  const empleados = datos?.empleados || [];

  return (
    <section id="equipo" className="seccion equipo">
      <div className="contenedor">
        <div className="seccion-encabezado">
          <h2>Quiénes cuidan cada historia</h2>
          <p>
            El equipo veterinario y el equipo humano detrás de cada
            adopción. Ambas listas vienen directo del personal registrado
            en el refugio.
          </p>
        </div>

        {cargando ? (
          <Cargando filas={3} alto={100} />
        ) : (
          <>
            <h3 className="equipo-subtitulo">Veterinarios</h3>
            <ul className="equipo-lista">
              {veterinarios.map((vet) => (
                <li key={vet.id} className="persona">
                  <span className="persona-avatar" aria-hidden="true">{iniciales(vet.nombre_completo)}</span>
                  <div>
                    <h4>{vet.nombre_completo}</h4>
                    <p className="persona-rol">{vet.especialidad}</p>
                    {vet.correo && <p className="persona-contacto">{vet.correo}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="equipo-subtitulo">Equipo del refugio</h3>
            <ul className="equipo-lista">
              {empleados.map((empleado) => (
                <li key={empleado.id} className="persona">
                  <span className="persona-avatar" aria-hidden="true">{iniciales(empleado.nombre_completo)}</span>
                  <div>
                    <h4>{empleado.nombre_completo}</h4>
                    <p className="persona-rol">{empleado.cargo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {origen === 'demo' && <AvisoDemo tabla="veterinarios / empleados" />}
      </div>
    </section>
  );
}
