// src/pages/Bienvenida.jsx
// Vista placeholder tras un login exitoso.
// Reemplázala por tu dashboard real cuando lo tengas listo.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Bienvenida({ usuario, onLogout }) {
  const cerrarSesion = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    onLogout();
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="paw-icon">🐾</div>
        <h1>¡Hola, {usuario.nombre}!</h1>
        <p>Has iniciado sesión correctamente en Huellitas.</p>
        <button className="btn-login btn-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
