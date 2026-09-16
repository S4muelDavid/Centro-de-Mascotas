// src/services/serviciosService.js
// Sección: Servicios  ->  /api/servicios
import api from './apiClient.js';

export const serviciosService = {
  async listar() {
    const datos = await api.get('/servicios');
    return datos.servicios;
  },
  crear:      (servicio)      => api.post('/servicios', servicio),
  actualizar: (id, servicio)  => api.put(`/servicios/${id}`, servicio),
  eliminar:   (id)            => api.delete(`/servicios/${id}`)
};

export default serviciosService;
