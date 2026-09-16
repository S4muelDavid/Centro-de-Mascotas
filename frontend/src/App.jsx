// src/App.jsx
<<<<<<< HEAD
// Decide qué página mostrar según la sesión que reporta el backend.

import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Inicio from './pages/Inicio.jsx';
import { authService } from './services/authService.js';
import Huella from './components/Huella.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login'); // 'login' | 'registro' | 'inicio'
  const [verificando, setVerificando] = useState(true);

  // Al cargar la app se pregunta al backend si la cookie de sesión
  // sigue siendo válida (por ejemplo, tras refrescar la página).
  useEffect(() => {
    authService.sesion()
      .then((datos) => {
        setUsuario(datos.usuario);
        setVista('inicio');
      })
      .catch(() => setUsuario(null))
      .finally(() => setVerificando(false));
  }, []);

  const autenticado = (usuarioAutenticado) => {
    setUsuario(usuarioAutenticado);
    setVista('inicio');
  };

  const salir = () => {
    setUsuario(null);
    setVista('login');
  };

  if (verificando) {
    return (
      <div className="pantalla-carga">
        <Huella tamano={52} />
        <p>Abriendo el refugio…</p>
      </div>
    );
  }

  if (vista === 'inicio' && usuario) {
    return <Inicio usuario={usuario} onLogout={salir} />;
  }

  if (vista === 'registro') {
    return (
      <Registro
        onRegistroExitoso={autenticado}
        onIrLogin={() => setVista('login')}
      />
    );
  }

  return (
    <Login
      onLoginExitoso={autenticado}
      onIrRegistro={() => setVista('registro')}
    />
  );
=======
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
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
}
