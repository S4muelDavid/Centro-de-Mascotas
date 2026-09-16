// src/sections/Mascotas.jsx
// Sección "Mascotas en adopción".
// Datos: GET /api/mascotas?especie=...&estado=disponible  ->  tabla `mascotas`
// El filtro se resuelve en el servidor (cláusula WHERE), no en el navegador,
// para que siga funcionando cuando el catálogo crezca.

import { useState } from 'react';
import { mascotasService } from '../services/mascotasService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { MASCOTAS_DEMO, ESPECIES_DEMO } from '../data/demo.js';
import MascotaCard from '../components/MascotaCard.jsx';
import { Cargando, AvisoDemo, ErrorSeccion } from '../components/EstadoSeccion.jsx';
import '../styles/secciones/mascotas.css';

export default function Mascotas() {
  const [especie, setEspecie] = useState('todas');
  const [elegida, setElegida] = useState(null);

  // Los botones de filtro salen de la tabla `especies` (10 filas en tu
  // base: Perro, Gato, Ave, Roedor...), no de una lista fija.
  const { datos: especies } = useDatosSeccion(
    () => mascotasService.especies(),
    ESPECIES_DEMO
  );

  const { datos: mascotas, cargando, error, origen, recargar } = useDatosSeccion(
    () => mascotasService.listar({ especie, estado: 'disponible' }),
    MASCOTAS_DEMO,
    [especie]
  );

  const filtros = [
    { valor: 'todas', etiqueta: 'Todas' },
    ...especies
      .filter((e) => e.total > 0)
      .map((e) => ({ valor: e.nombre, etiqueta: e.nombre }))
  ];

  // Cuando se usan los datos de ejemplo, el filtro se aplica aquí
  const visibles = origen === 'bd'
    ? mascotas
    : mascotas.filter((m) => especie === 'todas' || m.especie_nombre === especie || m.especie === especie);

  return (
    <section id="mascotas" className="seccion mascotas">
      <div className="contenedor">
        <div className="mascotas-encabezado">
          <div className="seccion-encabezado">
            <h2>Están esperando</h2>
            <p>
              Cada ficha es un animal real que hoy duerme en el refugio o en un
              hogar de paso. Escríbenos y coordinamos una visita sin compromiso.
            </p>
          </div>

          <div className="filtros" role="group" aria-label="Filtrar por especie">
            {filtros.map((filtro) => (
              <button
                key={filtro.valor}
                type="button"
                className={`filtro ${especie === filtro.valor ? 'filtro-activo' : ''}`}
                aria-pressed={especie === filtro.valor}
                onClick={() => setEspecie(filtro.valor)}
              >
                {filtro.etiqueta}
              </button>
            ))}
          </div>
        </div>

        {cargando && <Cargando filas={3} alto={330} />}

        {!cargando && error && origen !== 'demo' && (
          <ErrorSeccion mensaje={error} onReintentar={recargar} />
        )}

        {!cargando && visibles.length === 0 && (
          <p className="mascotas-vacio">
            No hay mascotas de esa especie buscando hogar ahora mismo.
            Prueba con otro filtro o vuelve en unos días.
          </p>
        )}

        {!cargando && visibles.length > 0 && (
          <div className="mascotas-grid">
            {visibles.map((mascota) => (
              <MascotaCard key={mascota.id} mascota={mascota} onAdoptar={setElegida} />
            ))}
          </div>
        )}

        {origen === 'demo' && <AvisoDemo tabla="mascotas" />}
      </div>

      {/* Confirmación de interés: por ahora local, lista para convertirse
          en POST /api/solicitudes-adopcion cuando exista esa tabla. */}
      {elegida && (
        <div className="modal-fondo" role="dialog" aria-modal="true" aria-label={`Adoptar a ${elegida.nombre}`}>
          <div className="modal">
            <h3>Quieres conocer a {elegida.nombre}</h3>
            <p>
              Escríbenos a <a href="mailto:hola@huellitas.org">hola@huellitas.org</a> o
              llámanos al (604) 123 4567 y coordinamos la visita. Menciona el
              nombre de {elegida.nombre} para que preparemos su historia clínica.
            </p>
            <button type="button" className="boton boton-primario" onClick={() => setElegida(null)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
