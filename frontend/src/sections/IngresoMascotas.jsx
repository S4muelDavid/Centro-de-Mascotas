// src/sections/IngresoMascotas.jsx
// Sección "Ingreso de mascotas".
// Datos: POST /api/solicitudes  ->  tabla `solicitudes_ingreso`
// Los cuatro pasos sí son contenido fijo de la página: describen el
// proceso, no registros de la base.

import { useState } from 'react';
import { solicitudesService } from '../services/solicitudesService.js';
import { PASOS_INGRESO } from '../data/demo.js';
import '../styles/secciones/ingreso.css';

const FORMULARIO_VACIO = {
  nombre_mascota: '',
  especie: 'perro',
  edad_aproximada: '',
  descripcion: '',
  contacto_nombre: '',
  contacto_telefono: '',
  contacto_correo: ''
};

export default function IngresoMascotas({ usuario }) {
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_VACIO,
    contacto_nombre: usuario?.nombre || '',
    contacto_correo: usuario?.correo || ''
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const cambiar = (campo) => (e) =>
    setFormulario((actual) => ({ ...actual, [campo]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    setEnviando(true);

    try {
      const respuesta = await solicitudesService.enviar(formulario);
      setExito(respuesta.mensaje);
      setFormulario({
        ...FORMULARIO_VACIO,
        contacto_nombre: usuario?.nombre || '',
        contacto_correo: usuario?.correo || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="ingreso" className="seccion ingreso">
      <div className="contenedor ingreso-inner">
        <div className="ingreso-proceso">
          <div className="seccion-encabezado">
            <h2>¿Tienes una mascota que necesita hogar?</h2>
            <p>
              No la dejes en la calle. Cuéntanos su caso y el equipo lo revisa.
              Así funciona el proceso, de principio a fin.
            </p>
          </div>

          <ol className="pasos">
            {PASOS_INGRESO.map((paso) => (
              <li key={paso.numero} className="paso">
                <span className="paso-numero">{paso.numero}</span>
                <div className="paso-cuerpo">
                  <h3>{paso.titulo}</h3>
                  <p>{paso.descripcion}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <form className="ingreso-formulario" onSubmit={enviar} noValidate={false}>
          <h3>Registrar una mascota</h3>

          {error && <div className="aviso aviso-error" role="alert">{error}</div>}
          {exito && <div className="aviso aviso-exito" role="status">{exito}</div>}

          <div className="campo-fila">
            <div className="campo">
              <label htmlFor="nombre_mascota">Nombre de la mascota</label>
              <input
                id="nombre_mascota"
                value={formulario.nombre_mascota}
                onChange={cambiar('nombre_mascota')}
                placeholder="Si no tiene, ponle uno"
                required
              />
            </div>

            <div className="campo campo-corto">
              <label htmlFor="especie">Especie</label>
              <select id="especie" value={formulario.especie} onChange={cambiar('especie')}>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="otro">Otra</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="edad_aproximada">Edad aproximada</label>
            <input
              id="edad_aproximada"
              value={formulario.edad_aproximada}
              onChange={cambiar('edad_aproximada')}
              placeholder="Por ejemplo: cachorro, 2 años, adulto mayor"
            />
          </div>

          <div className="campo">
            <label htmlFor="descripcion">Su historia y su salud</label>
            <textarea
              id="descripcion"
              rows={4}
              value={formulario.descripcion}
              onChange={cambiar('descripcion')}
              placeholder="Cómo llegó a ti, cómo es su carácter, si tiene vacunas o alguna condición médica."
              required
            />
          </div>

          <div className="campo-fila">
            <div className="campo">
              <label htmlFor="contacto_nombre">Tu nombre</label>
              <input
                id="contacto_nombre"
                value={formulario.contacto_nombre}
                onChange={cambiar('contacto_nombre')}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="contacto_telefono">Tu teléfono</label>
              <input
                id="contacto_telefono"
                type="tel"
                value={formulario.contacto_telefono}
                onChange={cambiar('contacto_telefono')}
                placeholder="300 000 0000"
                required
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="contacto_correo">Tu correo</label>
            <input
              id="contacto_correo"
              type="email"
              value={formulario.contacto_correo}
              onChange={cambiar('contacto_correo')}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <button type="submit" className="boton boton-primario" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar solicitud'}
          </button>

          <p className="ingreso-nota">
            La solicitud queda en la tabla <code>solicitudes_ingreso</code> con
            estado pendiente hasta que el equipo la revise.
          </p>
        </form>
      </div>
    </section>
  );
}
