// database/generarHash.js
// Ejecuta: node database/generarHash.js
// Genera un hash bcrypt real para usar como contraseña de prueba en la BD.

const bcrypt = require('bcryptjs');

const passwordEnTextoPlano = '123456'; // cámbiala si quieres otra
const hash = bcrypt.hashSync(passwordEnTextoPlano, 10);

console.log('Copia este hash en tu INSERT de schema.sql:');
console.log(hash);
