// src/services/adopcionesService.js
// Historial de adopciones  ->  /api/adopciones  ->  tabla `adopciones`
import api from './apiClient.js';

export const adopcionesService = {
  async listar(mias) {
    const datos = await api.get(mias ? '/adopciones?mias=1' : '/adopciones');
    return datos.adopciones;
  },
  registrarInteres: (id_mascota) => api.post('/adopciones', { id_mascota })
};

export default adopcionesService;
