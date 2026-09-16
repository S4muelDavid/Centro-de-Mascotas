// src/components/Estrellas.jsx
// Calificación de 1 a 5. Si recibe onCambio, se vuelve interactiva
// (la usa el formulario de opiniones).

export default function Estrellas({ valor = 5, onCambio = null, etiqueta = 'Calificación' }) {
  const estrellas = [1, 2, 3, 4, 5];

  if (!onCambio) {
    return (
      <span className="estrellas" role="img" aria-label={`${valor} de 5 estrellas`}>
        {estrellas.map((n) => (
          <svg key={n} viewBox="0 0 24 24" className={n <= valor ? 'estrella-llena' : 'estrella-vacia'} aria-hidden="true">
            <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z" />
          </svg>
        ))}
      </span>
    );
  }

  return (
    <div className="estrellas estrellas-editables" role="radiogroup" aria-label={etiqueta}>
      {estrellas.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} de 5`}
          onClick={() => onCambio(n)}
          className={n <= valor ? 'estrella-llena' : 'estrella-vacia'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
