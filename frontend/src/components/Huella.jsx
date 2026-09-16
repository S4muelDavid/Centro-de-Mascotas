// src/components/Huella.jsx
// La huella de la marca, en SVG: escala sin pixelarse y hereda el color
// del texto, así sirve igual en el header claro que sobre el verde oscuro.

export default function Huella({ tamano = 24, className = '' }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="27" cy="33" rx="11" ry="14.5" transform="rotate(-22 27 33)" />
      <ellipse cx="50" cy="24" rx="11" ry="15" />
      <ellipse cx="73" cy="33" rx="11" ry="14.5" transform="rotate(22 73 33)" />
      <path d="M50 44c15 0 26 11 26 23 0 10-8 16-18 16-4.5 0-5.5 2.5-8 2.5S46 83 41.5 83c-10 0-18-6-18-16 0-12 11-23 26.5-23z" />
    </svg>
  );
}
