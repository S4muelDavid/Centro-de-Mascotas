// src/services/equipoService.js
// Sección: Equipo  ->  /api/equipo  ->  veterinarios + empleados
import api from './apiClient.js';

export const equipoService = {
  async listar() {
    const datos = await api.get('/equipo');
    return { veterinarios: datos.veterinarios, empleados: datos.empleados, resumen: datos.resumen };
  },
  veterinarios: async () => (await api.get('/equipo/veterinarios')).veterinarios,
  empleados: async () => (await api.get('/equipo/empleados')).empleados
};

export default equipoService;
