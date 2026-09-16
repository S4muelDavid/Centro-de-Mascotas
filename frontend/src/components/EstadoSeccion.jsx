// src/components/EstadoSeccion.jsx
// Envoltura que usan todas las secciones para mostrar, con el mismo
// lenguaje visual: carga, error de conexión y aviso de datos de ejemplo.

export function Cargando({ filas = 3, alto = 120 }) {
  return (
    <div className="esqueleto-grupo" aria-hidden="true">
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="esqueleto" style={{ height: alto }} />
      ))}
      <span className="visualmente-oculto">Cargando contenido…</span>
    </div>
  );
}

export function AvisoDemo({ tabla }) {
  return (
    <p className="aviso-demo">
      Contenido de ejemplo. Aparecerán los datos reales en cuanto la tabla
      <code> {tabla} </code> tenga registros.
    </p>
  );
}

export function ErrorSeccion({ mensaje, onReintentar }) {
  return (
    <div className="error-seccion" role="alert">
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" className="boton boton-contorno" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
