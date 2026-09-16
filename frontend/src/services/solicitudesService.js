// src/services/solicitudesService.js
// Sección: Ingreso de mascotas  ->  /api/solicitudes
import api from './apiClient.js';

export const solicitudesService = {
  enviar: (solicitud) => api.post('/solicitudes', solicitud),

  async listar(estado) {
    const datos = await api.get(estado ? `/solicitudes?estado=${estado}` : '/solicitudes');
    return datos.solicitudes;
  },

  cambiarEstado: (id, estado) => api.patch(`/solicitudes/${id}/estado`, { estado })
};

export default solicitudesService;
