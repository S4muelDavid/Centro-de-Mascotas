// src/pages/Inicio.jsx
// Arma el sitio como varios apartados independientes: el Navbar (o el
// Footer, o un botón dentro de una sección) elige cuál se muestra con
// `apartadoActivo`, y aquí se renderiza solo ese, no todos apilados.
// Para agregar un apartado nuevo: crea src/sections/MiSeccion.jsx, su CSS
// en src/styles/secciones/, súmalo a APARTADOS en Navbar.jsx y agrégalo
// al `switch` de abajo.

import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../sections/Hero.jsx';
import Servicios from '../sections/Servicios.jsx';
import Mascotas from '../sections/Mascotas.jsx';
import Tienda from '../sections/Tienda.jsx';
import Equipo from '../sections/Equipo.jsx';
import IngresoMascotas from '../sections/IngresoMascotas.jsx';
import Opiniones from '../sections/Opiniones.jsx';
import { authService } from '../services/authService.js';

export default function Inicio({ usuario, onLogout }) {
  const [apartadoActivo, setApartadoActivo] = useState('inicio');

  const cerrarSesion = async () => {
    try {
      await authService.logout();
    } finally {
      onLogout();
    }
  };

  // Cambiar de apartado siempre vuelve a poner la vista arriba, como
  // se esperaría al "ir a otra página" del sitio.
  const navegar = (id) => {
    setApartadoActivo(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderizarApartado = () => {
    switch (apartadoActivo) {
      case 'servicios':
        return <Servicios />;
      case 'mascotas':
        return <Mascotas />;
      case 'tienda':
        return <Tienda />;
      case 'equipo':
        return <Equipo />;
      case 'ingreso':
        return <IngresoMascotas usuario={usuario} />;
      case 'opiniones':
        return <Opiniones usuario={usuario} />;
      case 'inicio':
      default:
        return <Hero usuario={usuario} onNavegar={navegar} />;
    }
  };

  return (
    <>
      <Navbar
        usuario={usuario}
        apartadoActivo={apartadoActivo}
        onNavegar={navegar}
        onCerrarSesion={cerrarSesion}
      />

      <main>{renderizarApartado()}</main>

      <Footer onNavegar={navegar} />
    </>
  );
}
