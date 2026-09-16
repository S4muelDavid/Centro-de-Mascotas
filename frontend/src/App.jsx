// src/App.jsx
// Decide qué página mostrar según la sesión que reporta el backend.

import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Recuperar from './pages/Recuperar.jsx';
import Inicio from './pages/Inicio.jsx';
import { authService } from './services/authService.js';
import Huella from './components/Huella.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login'); // 'login' | 'registro' | 'recuperar' | 'inicio'
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

  if (vista === 'recuperar') {
    return <Recuperar onIrLogin={() => setVista('login')} />;
  }

  return (
    <Login
      onLoginExitoso={autenticado}
      onIrRegistro={() => setVista('registro')}
      onIrRecuperar={() => setVista('recuperar')}
    />
  );
}
