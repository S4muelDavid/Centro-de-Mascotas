// src/services/opinionesService.js
// Sección: Opiniones  ->  /api/opiniones
import api from './apiClient.js';

export const opinionesService = {
  async listar(limite) {
    const datos = await api.get(limite ? `/opiniones?limite=${limite}` : '/opiniones');
    return { opiniones: datos.opiniones, promedio: datos.promedio, total: datos.total };
  },

  crear:   (opinion) => api.post('/opiniones', opinion),
  aprobar: (id)      => api.patch(`/opiniones/${id}/aprobar`)
};

export default opinionesService;
