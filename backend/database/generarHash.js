<<<<<<< HEAD
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
=======
// database/generarHash.js
// Ejecuta: node database/generarHash.js
// Genera un hash bcrypt real para usar como contraseña de prueba en la BD.

const bcrypt = require('bcryptjs');

const passwordEnTextoPlano = '123456'; // cámbiala si quieres otra
const hash = bcrypt.hashSync(passwordEnTextoPlano, 10);

console.log('Copia este hash en tu INSERT de schema.sql:');
console.log(hash);
>>>>>>> 9b0a3d50ff3efb05d1e026d9170749023b58b402
