// src/components/MascotaCard.jsx
// Ficha de una mascota. Si la fila de MySQL trae foto_url la muestra;
// si no, dibuja un retrato generado a partir del nombre y la especie,
// para que el catálogo se vea completo aunque falten fotos.

import Huella from './Huella.jsx';

const FONDOS = [
  'linear-gradient(150deg, #2E5D4B 0%, #4C8064 100%)',
  'linear-gradient(150deg, #C9772F 0%, #E8A33D 100%)',
  'linear-gradient(150deg, #8C5A44 0%, #D9644A 100%)',
  'linear-gradient(150deg, #3D5A6C 0%, #6E8FA3 100%)'
];

function formatearEdad(meses) {
  if (!meses && meses !== 0) return 'Edad sin registrar';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const anios = Math.floor(meses / 12);
  const resto = meses % 12;
  const base = `${anios} ${anios === 1 ? 'año' : 'años'}`;
  return resto ? `${base} y ${resto} m` : base;
}

const TAMANOS = { pequeno: 'Pequeña', mediano: 'Mediana', grande: 'Grande' };
const SEXOS = { macho: 'Macho', hembra: 'Hembra' };

export default function MascotaCard({ mascota, onAdoptar }) {
  const {
    id, nombre, especie, raza, sexo, edad_meses,
    tamano, descripcion, foto_url, estado, esterilizado, vacunado
  } = mascota;

  const fondo = FONDOS[(id || 0) % FONDOS.length];
  const disponible = estado === 'disponible';

  return (
    <article className="ficha">
      <div className="ficha-retrato" style={foto_url ? undefined : { background: fondo }}>
        {foto_url ? (
          <img src={foto_url} alt={`Foto de ${nombre}`} loading="lazy" />
        ) : (
          <>
            <Huella tamano={78} className="ficha-huella" />
            <span className="ficha-inicial" aria-hidden="true">{nombre[0]}</span>
          </>
        )}

        {!disponible && (
          <span className="ficha-estado">
            {estado === 'adoptada' ? 'Ya tiene hogar' : 'En proceso'}
          </span>
        )}
      </div>

      <div className="ficha-cuerpo">
        <h3>{nombre}</h3>
        <p className="ficha-datos">
          {raza || (especie === 'gato' ? 'Gato' : 'Perro')} · {formatearEdad(edad_meses)}
          {sexo ? ` · ${SEXOS[sexo]}` : ''}
          {tamano ? ` · ${TAMANOS[tamano]}` : ''}
        </p>

        {descripcion && <p className="ficha-descripcion">{descripcion}</p>}

        <ul className="ficha-salud">
          <li className={esterilizado ? 'si' : 'no'}>
            {esterilizado ? 'Esterilizada' : 'Sin esterilizar'}
          </li>
          <li className={vacunado ? 'si' : 'no'}>
            {vacunado ? 'Vacunas al día' : 'Vacunas pendientes'}
          </li>
        </ul>

        <button
          type="button"
          className="boton boton-solido ficha-boton"
          disabled={!disponible}
          onClick={() => onAdoptar?.(mascota)}
        >
          {disponible ? `Quiero conocer a ${nombre}` : 'No disponible'}
        </button>
      </div>
    </article>
  );
}
