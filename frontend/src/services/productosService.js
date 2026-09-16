// src/services/productosService.js
// Sección: Tienda  ->  /api/productos  ->  productos + inventarios + proveedores
import api from './apiClient.js';

export const productosService = {
  async listar(limite) {
    const datos = await api.get(limite ? `/productos?limite=${limite}` : '/productos');
    return { productos: datos.productos, resumen: datos.resumen };
  },

  async detalle(id) {
    const datos = await api.get(`/productos/${id}`);
    return datos.producto;
  },

  async proveedores() {
    const datos = await api.get('/productos/proveedores');
    return datos.proveedores;
  },

  actualizarStock: (id, cantidad) => api.patch(`/productos/${id}/stock`, { cantidad })
};

export default productosService;
