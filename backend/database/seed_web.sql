-- ============================================================
--  Huellitas · datos de arranque para la parte web
--
--  OPCIONAL, pero recomendado la primera vez.
--  Ejecútalo DESPUÉS de migracion_mascotas.sql:
--      mysql -u root -p mascotas < database/seed_web.sql
--
--  Por qué existe: en tu base, las 10 mascotas ya tienen una
--  fila en `adopciones`, así que la web las muestra como
--  "adoptadas" o "en proceso" y el catálogo sale vacío.
--  Esto agrega mascotas SIN adopción (= disponibles) y unas
--  opiniones aprobadas, para que todas las secciones tengan
--  algo que mostrar desde el primer arranque.
--
--  No toca ni borra ninguno de tus registros.
-- ============================================================

SET NAMES utf8mb4;

USE `mascotas`;

-- ---------- Mascotas disponibles para adopción ----------
-- id_usuario = 5 (Jorge Díaz, Admin) = responsable en el refugio
INSERT INTO `mascotas`
  (`nombre`, `edad`, `sexo`, `peso`, `fecha_nacimiento`, `estado`,
   `id_especie`, `id_raza`, `id_usuario`, `descripcion`, `tamano`,
   `esterilizado`, `vacunado`)
SELECT * FROM (
  SELECT 'Canela' AS nombre, 2 AS edad, 'Hembra' AS sexo, 18 AS peso, '2024-03-14' AS fecha_nacimiento, 'Saludable' AS estado,
         1 AS id_especie, 1 AS id_raza, 5 AS id_usuario,
         'Llegó tímida y hoy saluda a todo el mundo. Se lleva bien con otros perros y con niños.' AS descripcion,
         'mediano' AS tamano, 1 AS esterilizado, 1 AS vacunado
  UNION ALL SELECT 'Tomás', 4, 'Macho', 34, '2022-06-02', 'Saludable', 1, 2, 5,
         'Pastor alemán tranquilo y obediente. Busca una familia que salga a caminar todos los días.', 'grande', 1, 1
  UNION ALL SELECT 'Michi', 1, 'Macho', 4, '2025-02-08', 'Saludable', 2, 3, 5,
         'Dormilón, muy limpio e ideal para apartamento. Ya usa arenero sin problema.', 'pequeno', 1, 1
  UNION ALL SELECT 'Nube', 3, 'Hembra', 5, '2023-09-21', 'Saludable', 2, 4, 5,
         'Persa de pelo largo, curiosa y sociable. Necesita cepillado dos veces por semana.', 'pequeno', 1, 1
  UNION ALL SELECT 'Kiwi', 1, 'Macho', 1, '2025-05-30', 'Saludable', 3, 5, 5,
         'Perico australiano joven, alegre y acostumbrado a la mano. Silba desde temprano.', 'pequeno', 0, 0
  UNION ALL SELECT 'Trufa', 1, 'Hembra', 1, '2025-07-12', 'En Tratamiento', 4, 6, 5,
         'Hámster rescatada, en control por una lesión leve en la pata. Muy dócil.', 'pequeno', 0, 0
) AS nuevas
WHERE NOT EXISTS (SELECT 1 FROM `mascotas` WHERE `nombre` = 'Canela' AND `id_usuario` = 5);

-- ---------- Opiniones aprobadas ----------
INSERT INTO `opiniones` (`id_usuario`, `id_mascota`, `nombre_autor`, `mascota`, `texto`, `calificacion`, `aprobado`)
SELECT * FROM (
  SELECT 1 AS id_usuario, 1 AS id_mascota, 'Carlos Pérez' AS nombre_autor, 'Max' AS mascota,
         'El proceso fue cercano y transparente. Nos explicaron todo sin apuro y hoy Max duerme en el sofá como si siempre hubiera vivido aquí.' AS texto,
         5 AS calificacion, 1 AS aprobado
  UNION ALL SELECT 2, 2, 'Ana Gómez', 'Luna',
         'Lo que más me gustó fue el seguimiento después de la adopción. Se nota que les importa cómo termina la historia.', 5, 1
  UNION ALL SELECT 6, 10, 'Sofía Vargas', 'Bacon',
         'Nos ayudaron a elegir según nuestro apartamento y nuestros horarios, no según la mascota que más rápido salía.', 4, 1
  UNION ALL SELECT 10, 7, 'Elena Rojas', 'Iggy',
         'Recibí asesoría hasta para armar el terrario. Un mes después volvieron a escribirme para saber cómo iba todo.', 5, 1
) AS nuevas
WHERE NOT EXISTS (SELECT 1 FROM `opiniones`);

-- ---------- Una solicitud de ingreso de ejemplo ----------
INSERT INTO `solicitudes_ingreso`
  (`id_usuario`, `nombre_mascota`, `especie`, `edad_aproximada`, `descripcion`,
   `contacto_nombre`, `contacto_telefono`, `contacto_correo`, `estado`)
SELECT 3, 'Pecas', 'Perro', 'Cachorro, 4 meses',
       'Apareció en el parque del barrio, sin placa y con hambre. Está sano y es muy sociable con la gente.',
       'Luis Rodríguez', '3003334455', 'luis@mail.com', 'pendiente'
WHERE NOT EXISTS (SELECT 1 FROM `solicitudes_ingreso`);
