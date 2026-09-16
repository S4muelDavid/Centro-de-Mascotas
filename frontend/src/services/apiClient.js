// src/services/apiClient.js
// Único punto del frontend que sabe hablar con el backend.
// Todos los servicios de sección lo usan, así que si cambia la URL,
// la autenticación o el manejo de errores, se cambia solo aquí.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

async function pedir(ruta, opciones = {}) {
  const { method = 'GET', body, ...resto } = opciones;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      credentials: 'include', // manda la cookie de sesión
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      ...resto
    });
  } catch {
    throw new ErrorApi('No hay conexión con el servidor. Revisa que el backend esté corriendo.', 0);
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok || (datos && datos.ok === false)) {
    throw new ErrorApi(datos?.mensaje || 'No se pudo completar la operación.', respuesta.status);
  }

  return datos;
}

export const api = {
  get:    (ruta)        => pedir(ruta),
  post:   (ruta, body)  => pedir(ruta, { method: 'POST', body }),
  put:    (ruta, body)  => pedir(ruta, { method: 'PUT', body }),
  patch:  (ruta, body)  => pedir(ruta, { method: 'PATCH', body }),
  delete: (ruta)        => pedir(ruta, { method: 'DELETE' })
};

export default api;
