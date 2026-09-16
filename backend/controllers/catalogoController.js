// backend/controllers/catalogoController.js
// Controlador de la sección "Tienda": productos, inventario y proveedores.

const Catalogo = require('../models/Catalogo');

const catalogoController = {
  async listar(req, res, next) {
    try {
      const [productos, resumen] = await Promise.all([
        Catalogo.listarProductos({ limite: req.query.limite }),
        Catalogo.resumen()
      ]);
      res.json({
        ok: true,
        total: productos.length,
        productos,
        resumen: {
          referencias: Number(resumen.referencias || 0),
          unidades: Number(resumen.unidades || 0),
          valor_inventario: Number(resumen.valor_inventario || 0),
          en_stock_bajo: Number(resumen.en_stock_bajo || 0)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async detalle(req, res, next) {
    try {
      const producto = await Catalogo.buscarProducto(req.params.id);
      if (!producto) {
        return res.status(404).json({ ok: false, mensaje: 'Ese producto no está en el catálogo.' });
      }
      res.json({ ok: true, producto });
    } catch (err) {
      next(err);
    }
  },

  async proveedores(req, res, next) {
    try {
      const proveedores = await Catalogo.listarProveedores();
      res.json({ ok: true, total: proveedores.length, proveedores });
    } catch (err) {
      next(err);
    }
  },

  async actualizarStock(req, res, next) {
    const cantidad = Number(req.body.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return res.status(400).json({ ok: false, mensaje: 'La cantidad debe ser un número entero de 0 en adelante.' });
    }
    try {
      await Catalogo.actualizarStock(req.params.id, cantidad);
      res.json({ ok: true, mensaje: 'Inventario actualizado.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = catalogoController;
