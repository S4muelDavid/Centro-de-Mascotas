// src/App.jsx
// Componente raíz: decide si mostrar el Login o la vista de Bienvenida
// según haya o no una sesión activa contra el backend.

import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Bienvenida from './pages/Bienvenida.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, revisa si ya hay una sesión activa (por ejemplo,
  // si el usuario refresca la página)
  useEffect(() => {
    fetch(`${API_URL}/auth/sesion`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUsuario(data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return null;

  return usuario
    ? <Bienvenida usuario={usuario} onLogout={() => setUsuario(null)} />
    : <Login onLoginExitoso={(u) => setUsuario(u)} />;
}
