// src/hooks/useDatosSeccion.js
// Hook que usan todas las secciones para traer sus datos.
//
// Recibe la función que consulta la API y unos datos de respaldo.
// Si la API responde, muestra datos reales (origen: 'bd').
// Si todavía no hay backend o base de datos, muestra el respaldo
// (origen: 'demo') en lugar de dejar la sección vacía.
//
//   const { datos, cargando, error, origen, recargar } =
//     useDatosSeccion(() => mascotasService.listar(), MASCOTAS_DEMO);

import { useCallback, useEffect, useState } from 'react';

export function useDatosSeccion(cargar, respaldo = null, dependencias = []) {
  const [datos, setDatos] = useState(respaldo);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState('cargando'); // 'bd' | 'demo'

  const ejecutar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await cargar();
      const vacio = Array.isArray(resultado) ? resultado.length === 0 : !resultado;

      if (vacio && respaldo) {
        setDatos(respaldo);
        setOrigen('demo');
      } else {
        setDatos(resultado);
        setOrigen('bd');
      }
    } catch (err) {
      setError(err.message);
      if (respaldo) {
        setDatos(respaldo);
        setOrigen('demo');
      }
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => { ejecutar(); }, [ejecutar]);

  return { datos, cargando, error, origen, recargar: ejecutar };
}

export default useDatosSeccion;
