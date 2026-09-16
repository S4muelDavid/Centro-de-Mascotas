-- ============================================================
--  Huellitas · migración sobre la base REAL `mascotas`
--
--  Este archivo NO borra nada. Toma la base que ya tienes
--  (adopciones, empleados, especies, inventarios, mascotas,
--  productos, proveedores, razas, servicios, usuarios,
--  veterinarios) y le agrega solo lo que la página necesita:
--
--    1. Columnas de presentación en `servicios` y `mascotas`
--    2. Las dos tablas que la web usa y la base no tenía:
--       `solicitudes_ingreso` y `opiniones`
--    3. Índices y llaves únicas para login y filtros
--
--  Ejecútalo así (o pégalo en la pestaña SQL de phpMyAdmin):
--      mysql -u root -p mascotas < database/migracion_mascotas.sql
-- ============================================================

-- Sin esta línea, XAMPP/WAMP y la consola de Windows guardan
-- los acentos mal: "Adopción" queda como "AdopciÃ³n".
SET NAMES utf8mb4;

USE `mascotas`;

-- ------------------------------------------------------------
-- 1. usuarios  ->  login y registro
--    La base trae las contraseñas en texto plano ('pass1234').
--    El backend las acepta una última vez y las vuelve a guardar
--    con hash bcrypt automáticamente (ver models/Usuario.js).
--    Por eso la columna sube a 255 caracteres.
-- ------------------------------------------------------------
ALTER TABLE `usuarios`
  MODIFY `password` VARCHAR(255) DEFAULT NULL,
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuarios`
  ADD UNIQUE KEY IF NOT EXISTS `uq_usuarios_correo` (`correo`),
  ADD UNIQUE KEY IF NOT EXISTS `uq_usuarios_username` (`username`);

-- ------------------------------------------------------------
-- 2. servicios  ->  sección "Lo que hacemos"
--    Se conservan nombre, descripcion y precio. Solo se agrega
--    cómo se ve cada servicio en la página.
-- ------------------------------------------------------------
ALTER TABLE `servicios`
  ADD COLUMN IF NOT EXISTS `icono`  VARCHAR(16) DEFAULT NULL AFTER `nombre`,
  ADD COLUMN IF NOT EXISTS `orden`  INT(11)     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `activo` TINYINT(1)  NOT NULL DEFAULT 1,
  MODIFY `id_servicio` INT(11) NOT NULL AUTO_INCREMENT;

UPDATE `servicios` SET `icono` = '🩺', `orden` = 1  WHERE `id_servicio` = 1;
UPDATE `servicios` SET `icono` = '💉', `orden` = 2  WHERE `id_servicio` = 2;
UPDATE `servicios` SET `icono` = '💉', `orden` = 3  WHERE `id_servicio` = 3;
UPDATE `servicios` SET `icono` = '🛁', `orden` = 4  WHERE `id_servicio` = 4;
UPDATE `servicios` SET `icono` = '🐛', `orden` = 5  WHERE `id_servicio` = 5;
UPDATE `servicios` SET `icono` = '🧪', `orden` = 6  WHERE `id_servicio` = 6;
UPDATE `servicios` SET `icono` = '🦷', `orden` = 7  WHERE `id_servicio` = 7;
UPDATE `servicios` SET `icono` = '🏥', `orden` = 8  WHERE `id_servicio` = 8;
UPDATE `servicios` SET `icono` = '📡', `orden` = 9  WHERE `id_servicio` = 9;
UPDATE `servicios` SET `icono` = '✂️', `orden` = 10 WHERE `id_servicio` = 10;
UPDATE `servicios` SET `icono` = '🐾' WHERE `icono` IS NULL;

-- ------------------------------------------------------------
-- 2b. especies y razas  ->  necesarias para publicar mascotas nuevas
--     desde la página (el formulario puede escribir una especie o
--     raza que todavía no exista, y el backend la crea al vuelo).
-- ------------------------------------------------------------
ALTER TABLE `especies`
  MODIFY `id_especie` INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `razas`
  MODIFY `id_raza` INT(11) NOT NULL AUTO_INCREMENT;

-- ------------------------------------------------------------
-- 3. mascotas  ->  fichas del catálogo de adopción
--    `estado` (Saludable / En Tratamiento) se queda como está:
--    es el estado de SALUD. La disponibilidad para adoptar sale
--    de la tabla `adopciones`, que ya existe.
-- ------------------------------------------------------------
ALTER TABLE `mascotas`
  ADD COLUMN IF NOT EXISTS `descripcion`  TEXT         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `foto_url`     VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `tamano`       VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `esterilizado` TINYINT(1)   NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `vacunado`     TINYINT(1)   NOT NULL DEFAULT 0,
  MODIFY `id_mascota` INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `mascotas`
  ADD KEY IF NOT EXISTS `idx_mascotas_estado` (`estado`);

-- Historia y datos de ficha para las 10 mascotas que ya tenías
UPDATE `mascotas` SET `descripcion` = 'Labrador grande y sociable. Camina bien con correa y adora el agua.',        `tamano` = 'grande',  `esterilizado` = 1, `vacunado` = 1 WHERE `id_mascota` = 1;
UPDATE `mascotas` SET `descripcion` = 'Siamesa conversadora. Se adapta rápido y convive con otros gatos.',          `tamano` = 'pequeno', `esterilizado` = 1, `vacunado` = 1 WHERE `id_mascota` = 2;
UPDATE `mascotas` SET `descripcion` = 'Pastor alemán en tratamiento de dieta. Obediente y muy apegado.',            `tamano` = 'grande',  `esterilizado` = 1, `vacunado` = 1 WHERE `id_mascota` = 3;
UPDATE `mascotas` SET `descripcion` = 'Gata persa joven, tranquila y de interior. Necesita cepillado frecuente.',   `tamano` = 'pequeno', `esterilizado` = 0, `vacunado` = 1 WHERE `id_mascota` = 4;
UPDATE `mascotas` SET `descripcion` = 'Perico australiano criado a mano. Silba y repite palabras cortas.',          `tamano` = 'pequeno', `esterilizado` = 0, `vacunado` = 0 WHERE `id_mascota` = 5;
UPDATE `mascotas` SET `descripcion` = 'Hámster sirio solitario. Necesita jaula propia y rueda silenciosa.',         `tamano` = 'pequeno', `esterilizado` = 0, `vacunado` = 0 WHERE `id_mascota` = 6;
UPDATE `mascotas` SET `descripcion` = 'Iguana verde herbívora. Requiere terrario con lámpara de calor.',            `tamano` = 'mediano', `esterilizado` = 0, `vacunado` = 0 WHERE `id_mascota` = 7;
UPDATE `mascotas` SET `descripcion` = 'Pez betta hembra. Vive sola en pecera de 50 litros con filtro suave.',       `tamano` = 'pequeno', `esterilizado` = 0, `vacunado` = 0 WHERE `id_mascota` = 8;
UPDATE `mascotas` SET `descripcion` = 'Hurón dócil y curioso. Ya está esterilizado y usa arenero.',                 `tamano` = 'pequeno', `esterilizado` = 1, `vacunado` = 1 WHERE `id_mascota` = 9;
UPDATE `mascotas` SET `descripcion` = 'Mini pig criado en casa. Come dieta controlada y aprende trucos.',           `tamano` = 'mediano', `esterilizado` = 1, `vacunado` = 1 WHERE `id_mascota` = 10;

-- ------------------------------------------------------------
-- 4. adopciones  ->  disponibilidad del catálogo
--    La web lee esta tabla para saber si una mascota está
--    disponible, en proceso o ya adoptada. Solo se agrega el
--    índice que hace rápido ese cruce.
-- ------------------------------------------------------------
ALTER TABLE `adopciones`
  ADD KEY IF NOT EXISTS `idx_adopciones_estado` (`estado`),
  MODIFY `id_adopcion` INT(11) NOT NULL AUTO_INCREMENT;

-- ------------------------------------------------------------
-- 5. solicitudes_ingreso  ->  sección "Ingreso de mascotas"
--    Tabla nueva: no existía en la base.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `solicitudes_ingreso` (
  `id_solicitud`      INT(11)      NOT NULL AUTO_INCREMENT,
  `id_usuario`        INT(11)      DEFAULT NULL,
  `nombre_mascota`    VARCHAR(80)  NOT NULL,
  `especie`           VARCHAR(60)  NOT NULL DEFAULT 'Perro',
  `edad_aproximada`   VARCHAR(40)  DEFAULT NULL,
  `descripcion`       TEXT         NOT NULL,
  `contacto_nombre`   VARCHAR(100) NOT NULL,
  `contacto_telefono` VARCHAR(30)  NOT NULL,
  `contacto_correo`   VARCHAR(150) DEFAULT NULL,
  `estado`            VARCHAR(30)  NOT NULL DEFAULT 'pendiente',
  `created_at`        TIMESTAMP    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_solicitud`),
  KEY `idx_solicitud_estado` (`estado`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 6. opiniones  ->  sección "Familias que ya adoptaron"
--    Tabla nueva: no existía en la base.
--    Entran con aprobado = 0 y solo salen en la página cuando
--    alguien del equipo las aprueba.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `opiniones` (
  `id_opinion`   INT(11)      NOT NULL AUTO_INCREMENT,
  `id_usuario`   INT(11)      DEFAULT NULL,
  `id_mascota`   INT(11)      DEFAULT NULL,
  `nombre_autor` VARCHAR(100) NOT NULL,
  `mascota`      VARCHAR(80)  DEFAULT NULL,
  `texto`        TEXT         NOT NULL,
  `calificacion` TINYINT(4)   NOT NULL DEFAULT 5,
  `aprobado`     TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_opinion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_mascota` (`id_mascota`),
  CONSTRAINT `opiniones_ibfk_1` FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `opiniones_ibfk_2` FOREIGN KEY (`id_mascota`)
    REFERENCES `mascotas` (`id_mascota`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
