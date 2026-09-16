// backend/models/Mascota.js
// Modelo de la sección "Mascotas en adopción".
//
// La tabla real `mascotas` guarda id_especie / id_raza / id_usuario,
// no textos. Aquí se cruzan las cuatro tablas de tu base para que el
// frontend reciba la ficha ya armada:
//
//   mascotas  ->  especies   (nombre de la especie)
//             ->  razas      (nombre de la raza)
//             ->  usuarios   (quién la tiene a cargo)
//             ->  adopciones (si ya tiene familia o está en proceso)
//
// Dos traducciones que se hacen en SQL, no en el navegador:
//  - `estado` de la tabla mascotas es el estado de SALUD
//    (Saludable / En Tratamiento) y sale como `estado_salud`.
//  - El `estado` que usa la web (disponible / en_proceso / adoptada)
//    se deduce de la tabla `adopciones`.

const { pool } = require('../config/db');

// Vista base: una fila = una ficha lista para la página.
const SELECT_BASE = `
  SELECT
    m.id_mascota                              AS id,
    m.nombre,
    -- clave corta para los filtros de la página
    CASE
      WHEN LOWER(e.nombre) = 'perro' THEN 'perro'
      WHEN LOWER(e.nombre) = 'gato'  THEN 'gato'
      ELSE 'otro'
    END                                       AS especie,
    e.nombre                                  AS especie_nombre,
    e.id_especie,
    e.descripcion                             AS especie_descripcion,
    r.nombre                                  AS raza,
    r.id_raza,
    LOWER(m.sexo)                             AS sexo,
    m.edad                                    AS edad_anios,
    COALESCE(
      TIMESTAMPDIFF(MONTH, m.fecha_nacimiento, CURDATE()),
      m.edad * 12
    )                                         AS edad_meses,
    m.peso,
    m.fecha_nacimiento,
    m.estado                                  AS estado_salud,
    m.descripcion,
    m.foto_url,
    COALESCE(
      m.tamano,
      CASE
        WHEN m.peso IS NULL  THEN NULL
        WHEN m.peso < 10     THEN 'pequeno'
        WHEN m.peso < 25     THEN 'mediano'
        ELSE 'grande'
      END
    )                                         AS tamano,
    m.esterilizado,
    m.vacunado,
    m.id_usuario,
    TRIM(CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, ''))) AS responsable,
    u.telefono                                AS responsable_telefono,
    m.created_at                              AS creado_en,
    COALESCE(ad.estado_web, 'disponible')     AS estado,
    ad.fecha_adopcion
  FROM mascotas m
  INNER JOIN especies e ON e.id_especie = m.id_especie
  INNER JOIN razas    r ON r.id_raza    = m.id_raza
  LEFT  JOIN usuarios u ON u.id         = m.id_usuario
  LEFT  JOIN (
    -- Una mascota puede tener varias filas en adopciones;
    -- si alguna está completada, ya tiene familia.
    SELECT
      id_mascota,
      MAX(fecha_adopcion) AS fecha_adopcion,
      CASE
        WHEN SUM(LOWER(estado) IN ('completada', 'completado', 'adoptada')) > 0
          THEN 'adoptada'
        ELSE 'en_proceso'
      END AS estado_web
    FROM adopciones
    GROUP BY id_mascota
  ) ad ON ad.id_mascota = m.id_mascota
`;

const Mascota = {
  // Los filtros se resuelven en el servidor. Como `especie` y `estado`
  // son columnas calculadas, la consulta base se envuelve en una
  // subconsulta para poder filtrarlas con WHERE.
  async listar({ especie, estado = 'disponible', limite } = {}) {
    const condiciones = [];
    const valores = [];

    // El filtro llega como el NOMBRE real de la especie (Perro, Gato,
    // Roedor...), no como una clave fija, porque tu base tiene 10
    // especies y no solo perro/gato/otro.
    if (especie && especie !== 'todas') {
      condiciones.push('LOWER(ficha.especie_nombre) = LOWER(?)');
      valores.push(especie);
    }
    if (estado && estado !== 'todas') {
      condiciones.push('ficha.estado = ?');
      valores.push(estado);
    }

    let sql = `SELECT * FROM (${SELECT_BASE}) AS ficha`;
    if (condiciones.length) sql += ` WHERE ${condiciones.join(' AND ')}`;
    sql += ' ORDER BY ficha.creado_en DESC, ficha.id DESC';

    if (limite) {
      sql += ' LIMIT ?';
      valores.push(Number(limite));
    }

    const [filas] = await pool.query(sql, valores);
    return filas;
  },

  async buscarPorId(id) {
    const [filas] = await pool.query(
      `SELECT * FROM (${SELECT_BASE}) AS ficha WHERE ficha.id = ? LIMIT 1`,
      [id]
    );
    return filas[0] || null;
  },

  // Alimenta la pizarra del hero: cuántas buscan hogar, cuántas
  // están en proceso y cuántas ya tienen familia.
  async contarPorEstado() {
    const [filas] = await pool.query(
      `SELECT ficha.estado, COUNT(*) AS total
         FROM (${SELECT_BASE}) AS ficha
        GROUP BY ficha.estado`
    );
    return filas;
  },

  // Especies reales de la base, con cuántas mascotas hay de cada una.
  // La sección de mascotas arma sus filtros con esto.
  async listarEspecies() {
    const [filas] = await pool.query(
      `SELECT e.id_especie, e.nombre, e.descripcion,
              COUNT(m.id_mascota) AS total
         FROM especies e
    LEFT JOIN mascotas m ON m.id_especie = e.id_especie
     GROUP BY e.id_especie, e.nombre, e.descripcion
     ORDER BY e.nombre ASC`
    );
    return filas;
  },

  async listarRazas(idEspecie) {
    const sql = idEspecie
      ? 'SELECT id_raza, nombre, descripcion, id_especie FROM razas WHERE id_especie = ? ORDER BY nombre'
      : 'SELECT id_raza, nombre, descripcion, id_especie FROM razas ORDER BY nombre';
    const [filas] = await pool.query(sql, idEspecie ? [idEspecie] : []);
    return filas;
  },

  // `especies` y `razas` son llaves foráneas obligatorias: si llega un
  // nombre que todavía no existe, se crea la fila en vez de fallar.
  async resolverEspecie(nombre) {
    const limpio = (nombre && String(nombre).trim()) || 'Perro';
    const [filas] = await pool.query(
      'SELECT id_especie FROM especies WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
      [limpio]
    );
    if (filas[0]) return filas[0].id_especie;

    const [resultado] = await pool.query(
      'INSERT INTO especies (nombre, descripcion) VALUES (?, ?)',
      [limpio, 'Registrada desde la página web']
    );
    return resultado.insertId;
  },

  async resolverRaza(nombre, idEspecie) {
    const limpio = (nombre && String(nombre).trim()) || 'Sin determinar';
    const [filas] = await pool.query(
      'SELECT id_raza FROM razas WHERE LOWER(nombre) = LOWER(?) AND id_especie = ? LIMIT 1',
      [limpio, idEspecie]
    );
    if (filas[0]) return filas[0].id_raza;

    const [resultado] = await pool.query(
      'INSERT INTO razas (nombre, descripcion, id_especie) VALUES (?, ?, ?)',
      [limpio, 'Registrada desde la página web', idEspecie]
    );
    return resultado.insertId;
  },

  async crear(datos) {
    const {
      nombre, especie = 'Perro', raza = null, sexo = null,
      edad_meses = null, edad = null, peso = null, fecha_nacimiento = null,
      estado_salud = 'Saludable', descripcion = null, foto_url = null,
      tamano = null, esterilizado = 0, vacunado = 0, id_usuario = null
    } = datos;

    const idEspecie = await Mascota.resolverEspecie(especie);
    const idRaza = await Mascota.resolverRaza(raza, idEspecie);

    // La tabla guarda la edad en años; la web trabaja en meses.
    const edadAnios = edad !== null && edad !== '' && edad !== undefined
      ? Number(edad)
      : (edad_meses ? Math.max(0, Math.floor(Number(edad_meses) / 12)) : null);

    const sexoBd = sexo
      ? String(sexo).charAt(0).toUpperCase() + String(sexo).slice(1).toLowerCase()
      : null;

    const [resultado] = await pool.query(
      `INSERT INTO mascotas
        (nombre, edad, sexo, peso, fecha_nacimiento, estado,
         id_especie, id_raza, id_usuario,
         descripcion, foto_url, tamano, esterilizado, vacunado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, edadAnios, sexoBd, peso, fecha_nacimiento || null, estado_salud,
       idEspecie, idRaza, id_usuario,
       descripcion, foto_url, tamano, esterilizado ? 1 : 0, vacunado ? 1 : 0]
    );
    return resultado.insertId;
  },

  // Cambiar la disponibilidad NO toca la columna `estado` de mascotas
  // (esa es la salud): escribe en la tabla `adopciones`, que es donde
  // tu base lleva realmente el proceso de adopción.
  async cambiarDisponibilidad(idMascota, estadoWeb, idUsuario) {
    if (estadoWeb === 'disponible') {
      await pool.query('DELETE FROM adopciones WHERE id_mascota = ?', [idMascota]);
      return;
    }

    const estadoBd = estadoWeb === 'adoptada' ? 'Completada' : 'En Proceso';
    const [existentes] = await pool.query(
      'SELECT id_adopcion FROM adopciones WHERE id_mascota = ? ORDER BY id_adopcion DESC LIMIT 1',
      [idMascota]
    );

    if (existentes[0]) {
      await pool.query(
        `UPDATE adopciones
            SET estado = ?, fecha_adopcion = CURDATE()
          WHERE id_adopcion = ?`,
        [estadoBd, existentes[0].id_adopcion]
      );
      return;
    }

    // Si no hay adoptante identificado, queda a nombre del responsable
    // de la mascota, para no romper la llave foránea con usuarios.
    let adoptante = idUsuario;
    if (!adoptante) {
      const [duenos] = await pool.query(
        'SELECT id_usuario FROM mascotas WHERE id_mascota = ? LIMIT 1',
        [idMascota]
      );
      adoptante = duenos[0]?.id_usuario;
    }

    await pool.query(
      `INSERT INTO adopciones (id_mascota, id_usuario, fecha_adopcion, estado, observaciones)
       VALUES (?, ?, CURDATE(), ?, ?)`,
      [idMascota, adoptante, estadoBd, 'Registrado desde la página web']
    );
  },

  // Cambia el estado de SALUD (columna `estado` de la tabla mascotas).
  async cambiarEstadoSalud(id, estadoSalud) {
    await pool.query('UPDATE mascotas SET estado = ? WHERE id_mascota = ?', [estadoSalud, id]);
  },

  async eliminar(id) {
    await pool.query('DELETE FROM adopciones WHERE id_mascota = ?', [id]);
    await pool.query('DELETE FROM mascotas WHERE id_mascota = ?', [id]);
  }
};

module.exports = Mascota;
