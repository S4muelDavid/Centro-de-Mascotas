-- database/schema.sql
-- Ejecuta este script en tu servidor MySQL para crear la base
-- y la tabla necesaria para el login

CREATE DATABASE IF NOT EXISTS adopcion_huellitas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE adopcion_huellitas;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario de prueba: primero genera un hash real ejecutando
-- "node database/generarHash.js" (incluido en el proyecto) y pega
-- el resultado aquí abajo antes de correr este INSERT.
--
-- INSERT INTO usuarios (nombre, correo, password)
-- VALUES ('Administrador', 'admin@huellitas.com', 'PEGA_AQUI_EL_HASH_GENERADO')
-- ON DUPLICATE KEY UPDATE correo = correo;
