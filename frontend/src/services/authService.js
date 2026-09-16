// src/services/authService.js
// Sección: login y registro  ->  /api/auth  ->  tabla `usuarios`
import api from './apiClient.js';

export const authService = {
  login:  (correo, password) => api.post('/auth/login', { correo, password }),

  // apellido/telefono/username son opcionales: si no se mandan, el
  // backend arma un username a partir del correo.
  registrar: (datos) => api.post('/auth/registro', datos),

  recuperar: (correo, nuevaPassword) => api.post('/auth/recuperar', { correo, nuevaPassword }),

  sesion:  () => api.get('/auth/sesion'),
  perfil:  () => api.get('/auth/perfil'),
  logout:  () => api.post('/auth/logout')
};

export default authService;
