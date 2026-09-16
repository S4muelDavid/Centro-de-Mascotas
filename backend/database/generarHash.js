// backend/database/generarHash.js
// Genera un hash bcrypt para insertar o corregir un usuario a mano.
// Uso:  node database/generarHash.js "miClaveSegura"

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'huellitas123';

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nContraseña :', password);
  console.log('Hash       :', hash);
  console.log('\nPara usarlo en la base:');
  console.log(`  UPDATE usuarios SET password = '${hash}' WHERE correo = 'alguien@mail.com';\n`);
});
