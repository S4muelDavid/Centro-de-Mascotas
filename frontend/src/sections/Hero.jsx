// src/sections/Hero.jsx
// Sección de portada. Lee GET /api/mascotas/resumen para mostrar
// cuántos animales hay hoy en cada estado: no es decoración, son las
// cifras vivas del refugio.

import { mascotasService } from '../services/mascotasService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { RESUMEN_DEMO } from '../data/demo.js';
import Huella from '../components/Huella.jsx';
import '../styles/secciones/hero.css';

export default function Hero({ usuario, onNavegar }) {
  const { datos: resumen, origen } = useDatosSeccion(
    () => mascotasService.resumen(),
    RESUMEN_DEMO
  );

  const primerNombre = (usuario?.nombre || '').split(' ')[0];

  return (
    <section id="inicio" className="hero">
      {/* Huellas de fondo: decoración sutil, fuera del árbol accesible */}
      <div className="hero-fondo" aria-hidden="true">
        <Huella tamano={180} />
        <Huella tamano={110} />
        <Huella tamano={70} />
      </div>

      <div className="contenedor hero-inner">
        <div className="hero-texto">
          <p className="hero-saludo">Hola de nuevo, {primerNombre}</p>
          <h1>
            Aquí empieza<br />la historia de<br />alguien que espera.
          </h1>
          <p className="hero-bajada">
            Rescatamos animales en riesgo en Medellín, los cuidamos hasta que
            están sanos y los acompañamos hasta su familia definitiva. Tú puedes
            adoptar, dar un hogar de paso o traernos una mascota que necesita ayuda.
          </p>

          <div className="hero-acciones">
            <button type="button" className="boton boton-primario" onClick={() => onNavegar('mascotas')}>
              Ver quién busca hogar
            </button>
            <button type="button" className="boton boton-claro" onClick={() => onNavegar('ingreso')}>
              Entregar una mascota
            </button>
          </div>
        </div>

        {/* La pizarra del refugio: el estado de hoy */}
        <aside className="pizarra" aria-label="Estado del refugio hoy">
          <h2 className="pizarra-titulo">Hoy en el refugio</h2>

          <dl className="pizarra-cifras">
            <div>
              <dt>Buscan hogar</dt>
              <dd>{resumen?.disponible ?? 0}</dd>
            </div>
            <div>
              <dt>En proceso de adopción</dt>
              <dd>{resumen?.en_proceso ?? 0}</dd>
            </div>
            <div>
              <dt>Ya encontraron familia</dt>
              <dd>{resumen?.adoptada ?? 0}</dd>
            </div>
          </dl>

          <p className="pizarra-nota">
            {origen === 'bd'
              ? 'Cifras tomadas de la base de datos.'
              : 'Cifras de ejemplo hasta conectar MySQL.'}
          </p>
        </aside>
      </div>
    </section>
  );
}
