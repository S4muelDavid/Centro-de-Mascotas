// src/services/mascotasService.js
// Sección: Mascotas en adopción  ->  /api/mascotas
import api from './apiClient.js';

export const mascotasService = {
  async listar({ especie = 'todas', estado = 'disponible', limite } = {}) {
    const params = new URLSearchParams({ especie, estado });
    if (limite) params.set('limite', limite);
    const datos = await api.get(`/mascotas?${params}`);
    return datos.mascotas;
  },

  async resumen() {
    const datos = await api.get('/mascotas/resumen');
    return datos.resumen;
  },

  async detalle(id) {
    const datos = await api.get(`/mascotas/${id}`);
    return datos.mascota;
  },

  // Especies reales de la tabla `especies`, para armar los botones de
  // filtro sin dejarlos escritos a mano en el componente.
  async especies() {
    const datos = await api.get('/mascotas/especies');
    return datos.especies;
  },

  crear:          (mascota)     => api.post('/mascotas', mascota),
  cambiarEstado:  (id, estado)  => api.patch(`/mascotas/${id}/estado`, { estado }),
  cambiarSalud:   (id, estado_salud) => api.patch(`/mascotas/${id}/salud`, { estado_salud })
};

export default mascotasService;
