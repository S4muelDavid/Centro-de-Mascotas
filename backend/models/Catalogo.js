// backend/models/Catalogo.js
// Modelo de la sección "Tienda": cruza las tres tablas de tu base que
// tenían que ver con productos y no estaban conectadas a la página.
//
//   productos  ->  inventarios  (cantidad real en bodega)
//              ->  proveedores  (quién lo surte)
//
// El `stock` que muestra la web sale de `inventarios.cantidad` cuando
// existe; si un producto todavía no tiene inventario, cae a
// `productos.stock`.

const { pool } = require('../config/db');

const Catalogo = {
  async listarProductos({ limite, soloDisponibles = false } = {}) {
    const valores = [];

    let sql = `
      SELECT
        p.id_producto                        AS id,
        p.nombre,
        p.descripcion,
        p.precio,
        COALESCE(i.cantidad, p.stock, 0)     AS stock,
        i.stock_minimo,
        i.stock_maximo,
        i.fecha_actualizacion,
        pr.id_proveedor,
        pr.nombre                            AS proveedor,
        pr.telefono                          AS proveedor_telefono,
        pr.correo                            AS proveedor_correo,
        CASE
          WHEN COALESCE(i.cantidad, p.stock, 0) = 0 THEN 'agotado'
          WHEN COALESCE(i.cantidad, p.stock, 0) <= COALESCE(i.stock_minimo, 0) THEN 'bajo'
          ELSE 'disponible'
        END                                  AS estado_stock,
        p.created_at                         AS creado_en
      FROM productos p
      LEFT JOIN inventarios i ON i.id_producto  = p.id_producto
      LEFT JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
    `;

    if (soloDisponibles) sql += ' WHERE COALESCE(i.cantidad, p.stock, 0) > 0';
    sql += ' ORDER BY p.nombre ASC';

    if (limite) {
      sql += ' LIMIT ?';
      valores.push(Number(limite));
    }

    const [filas] = await pool.query(sql, valores);
    return filas;
  },

  async buscarProducto(id) {
    const productos = await Catalogo.listarProductos();
    return productos.find((producto) => producto.id === Number(id)) || null;
  },

  async listarProveedores() {
    const [filas] = await pool.query(
      `SELECT pr.id_proveedor AS id,
              pr.nombre,
              pr.contacto,
              pr.telefono,
              pr.correo,
              pr.direccion,
              COUNT(p.id_producto) AS productos
         FROM proveedores pr
    LEFT JOIN productos p ON p.id_proveedor = pr.id_proveedor
     GROUP BY pr.id_proveedor, pr.nombre, pr.contacto, pr.telefono, pr.correo, pr.direccion
     ORDER BY pr.nombre ASC`
    );
    return filas;
  },

  // Tarjetas de resumen de la sección: cuántas referencias hay,
  // cuántas están en stock bajo y cuánto vale el inventario.
  async resumen() {
    const [filas] = await pool.query(
      `SELECT
         COUNT(*)                                                       AS referencias,
         SUM(COALESCE(i.cantidad, p.stock, 0))                          AS unidades,
         SUM(COALESCE(i.cantidad, p.stock, 0) * p.precio)               AS valor_inventario,
         SUM(COALESCE(i.cantidad, p.stock, 0) <= COALESCE(i.stock_minimo, 0)) AS en_stock_bajo
       FROM productos p
       LEFT JOIN inventarios i ON i.id_producto = p.id_producto`
    );
    return filas[0];
  },

  async actualizarStock(idProducto, cantidad) {
    const [existentes] = await pool.query(
      'SELECT id_inventario FROM inventarios WHERE id_producto = ? LIMIT 1',
      [idProducto]
    );

    if (existentes[0]) {
      await pool.query(
        'UPDATE inventarios SET cantidad = ? WHERE id_inventario = ?',
        [cantidad, existentes[0].id_inventario]
      );
    } else {
      await pool.query(
        'INSERT INTO inventarios (id_producto, cantidad, stock_minimo, stock_maximo) VALUES (?, ?, 0, ?)',
        [idProducto, cantidad, cantidad]
      );
    }

    // `productos.stock` se mantiene sincronizado para que las dos
    // tablas nunca cuenten cosas distintas.
    await pool.query('UPDATE productos SET stock = ? WHERE id_producto = ?', [cantidad, idProducto]);
  }
};

module.exports = Catalogo;
