// src/components/Navbar.jsx
// Barra superior: marca, navegación entre apartados y menú de usuario.
// Cada apartado es una "página" independiente (ver src/pages/Inicio.jsx);
// el Navbar solo avisa cuál quiere ver la persona, no hace scroll.

import { useEffect, useState } from 'react';
import Huella from './Huella.jsx';
import '../styles/navbar.css';

export const APARTADOS = [
  { id: 'inicio',    etiqueta: 'Inicio' },
  { id: 'servicios', etiqueta: 'Servicios' },
  { id: 'mascotas',  etiqueta: 'Mascotas' },
  { id: 'tienda',    etiqueta: 'Tienda' },
  { id: 'equipo',    etiqueta: 'Equipo' },
  { id: 'ingreso',   etiqueta: 'Ingreso de mascotas' },
  { id: 'opiniones', etiqueta: 'Opiniones' }
];

export default function Navbar({ usuario, apartadoActivo, onNavegar, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [conSombra, setConSombra] = useState(false);

  // La sombra del header depende del scroll dentro del apartado actual,
  // ya no de qué sección está "a la vista" (ahora solo hay una a la vez).
  useEffect(() => {
    const alHacerScroll = () => setConSombra(window.scrollY > 12);
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    alHacerScroll();
    return () => window.removeEventListener('scroll', alHacerScroll);
  }, []);

  const iniciales = (usuario?.nombre || '?')
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase();

  const ir = (id) => {
    onNavegar(id);
    setMenuAbierto(false);
  };

  return (
    <header className={`navbar ${conSombra ? 'navbar-fija' : ''}`}>
      <div className="navbar-inner contenedor">
        <button type="button" className="navbar-marca" onClick={() => ir('inicio')}>
          <Huella tamano={26} />
          <span>Huellitas</span>
        </button>

        <nav
          id="navegacion-principal"
          className={`navbar-enlaces ${menuAbierto ? 'abierto' : ''}`}
          aria-label="Apartados del sitio"
        >
          {APARTADOS.map((apartado) => (
            <button
              key={apartado.id}
              type="button"
              className={apartadoActivo === apartado.id ? 'activo' : ''}
              aria-current={apartadoActivo === apartado.id ? 'page' : undefined}
              onClick={() => ir(apartado.id)}
            >
              {apartado.etiqueta}
            </button>
          ))}
        </nav>

        <div className="navbar-usuario">
          <span className="navbar-avatar" title={usuario?.nombre}>{iniciales}</span>
          <span className="navbar-nombre">{usuario?.nombre}</span>
          <button type="button" className="navbar-salir" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
          <button
            type="button"
            className="navbar-toggle"
            aria-expanded={menuAbierto}
            aria-controls="navegacion-principal"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
