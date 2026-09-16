// src/sections/Tienda.jsx
// Sección "Tienda". Datos: GET /api/productos
// Tablas: productos + inventarios (cantidad real) + proveedores

import { useState } from 'react';
import { productosService } from '../services/productosService.js';
import { useDatosSeccion } from '../hooks/useDatosSeccion.js';
import { PRODUCTOS_DEMO } from '../data/demo.js';
import { Cargando, AvisoDemo } from '../components/EstadoSeccion.jsx';
import '../styles/secciones/tienda.css';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const ETIQUETAS_STOCK = {
  disponible: { texto: 'Disponible', clase: 'stock-ok' },
  bajo: { texto: 'Stock bajo', clase: 'stock-bajo' },
  agotado: { texto: 'Agotado', clase: 'stock-agotado' }
};

export default function Tienda() {
  const [buscar, setBuscar] = useState('');

  const { datos, cargando, origen } = useDatosSeccion(
    () => productosService.listar(),
    PRODUCTOS_DEMO
  );

  const productos = datos?.productos || [];
  const resumen = datos?.resumen;

  const visibles = productos.filter((p) =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <section id="tienda" className="seccion tienda">
      <div className="contenedor">
        <div className="seccion-encabezado">
          <h2>Tienda del refugio</h2>
          <p>
            Todo lo que vendemos sale del mismo inventario con el que
            trabajamos día a día: si aparece aquí, hay unidades reales
            en bodega.
          </p>
        </div>

        {resumen && (
          <dl className="tienda-cifras">
            <div>
              <dt>Referencias</dt>
              <dd>{resumen.referencias}</dd>
            </div>
            <div>
              <dt>Unidades en bodega</dt>
              <dd>{resumen.unidades}</dd>
            </div>
            <div>
              <dt>Stock bajo</dt>
              <dd>{resumen.en_stock_bajo}</dd>
            </div>
          </dl>
        )}

        <input
          type="search"
          className="tienda-buscador"
          placeholder="Buscar producto…"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          aria-label="Buscar producto"
        />

        {cargando ? (
          <Cargando filas={4} alto={90} />
        ) : (
          <ul className="tienda-lista">
            {visibles.map((producto) => {
              const etiqueta = ETIQUETAS_STOCK[producto.estado_stock] || ETIQUETAS_STOCK.disponible;
              return (
                <li key={producto.id} className="producto">
                  <div className="producto-cuerpo">
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                    {producto.proveedor && (
                      <p className="producto-proveedor">Proveedor: {producto.proveedor}</p>
                    )}
                  </div>
                  <div className="producto-datos">
                    <span className="producto-precio">{formatoCOP.format(producto.precio)}</span>
                    <span className={`producto-stock ${etiqueta.clase}`}>
                      {etiqueta.texto} · {producto.stock} un.
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!cargando && visibles.length === 0 && (
          <p className="tienda-vacio">No hay productos que coincidan con esa búsqueda.</p>
        )}

        {origen === 'demo' && <AvisoDemo tabla="productos" />}
      </div>
    </section>
  );
}
