// src/sections/Servicios.jsx
// Sección "Servicios".
// Datos: GET /api/servicios  ->  tabla `servicios`

import { serviciosService } from '../services/serviciosService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { SERVICIOS_DEMO } from '../data/demo.js';
import { Cargando, AvisoDemo } from '../components/EstadoSeccion.jsx';
import '../styles/secciones/servicios.css';

export default function Servicios() {
  const { datos: servicios, cargando, origen } = useDatosSeccion(
    () => serviciosService.listar(),
    SERVICIOS_DEMO
  );

  return (
    <section id="servicios" className="seccion servicios">
      <div className="contenedor">
        <div className="seccion-encabezado">
          <h2>Lo que hacemos</h2>
          <p>
            Adoptar no es llevarse un animal y ya. Estas son las cuatro cosas en
            las que acompañamos a cada familia y a cada mascota.
          </p>
        </div>

        {cargando ? (
          <Cargando filas={4} alto={96} />
        ) : (
          <ul className="servicios-lista">
            {servicios.map((servicio) => (
              <li key={servicio.id} className="servicio">
                <span className="servicio-icono" aria-hidden="true">{servicio.icono}</span>
                <div>
                  <h3>{servicio.titulo}</h3>
                  <p>{servicio.descripcion}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {origen === 'demo' && <AvisoDemo tabla="servicios" />}
      </div>
    </section>
  );
}
