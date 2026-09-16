// backend/database/hashearPasswords.js
// Convierte a hash bcrypt todas las contraseñas que todavía estén en
// texto plano en la tabla `usuarios`.
//
//   node database/hashearPasswords.js
//
// No es obligatorio: el login ya migra cada contraseña la primera vez
// que la persona entra. Esto solo hace lo mismo de una sola pasada.
// Después de correrlo, cada quien sigue entrando con la MISMA clave
// de siempre; lo único que cambia es cómo se guarda.

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const esHash = (valor) => typeof valor === 'string' && /^\$2[aby]\$/.test(valor);

(async () => {
  try {
    const [usuarios] = await pool.query('SELECT id, correo, password FROM usuarios');
    let convertidos = 0;

    for (const usuario of usuarios) {
      if (!usuario.password || esHash(usuario.password)) continue;
      const hash = await bcrypt.hash(usuario.password, 10);
      await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, usuario.id]);
      console.log(`  ${usuario.correo}  ->  hash aplicado`);
      convertidos += 1;
    }

    console.log(convertidos
      ? `\nListo: ${convertidos} contraseña(s) convertidas a bcrypt.\n`
      : '\nNo había contraseñas en texto plano. Nada que hacer.\n');
  } catch (err) {
    console.error('\nNo se pudo completar:', err.message, '\n');
  } finally {
    await pool.end();
  }
})();
