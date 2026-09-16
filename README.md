# Huellitas · Centro de Adopción

Aplicación web de un refugio de mascotas. Backend en Node/Express con
arquitectura MVC, frontend en React (Vite), conectados a **tu base de
datos real `mascotas`** (la del volcado `mascotas.sql`, con las 11
tablas: usuarios, mascotas, especies, razas, adopciones, servicios,
productos, inventarios, proveedores, veterinarios y empleados).

Cada sección de la página está en su propio archivo y tiene su propia
ruta hacia la base de datos, así que se pueden trabajar por separado.

> **Esta versión fue adaptada a tu base real.** El proyecto original
> traía su propio esquema (`adopcion_huellitas`, 5 tablas con otros
> nombres de columna). Aquí todo el backend se reescribió para leer y
> escribir directamente en tu base `mascotas`, sin perder ni un
> registro. Ver la sección **"Cómo se adaptó a tu base real"** más
> abajo para el detalle de cada cruce de tablas.

---

## Estructura

```
huellitas/
├── backend/
│   ├── server.js                    Punto de entrada
│   ├── config/db.js                 Pool de conexión a MySQL
│   ├── middlewares/
│   │   ├── requiereSesion.js        Protege rutas que piden login
│   │   └── manejarErrores.js        Traduce los fallos de MySQL a español
│   ├── models/                      Todo el SQL vive aquí
│   │   ├── Usuario.js
│   │   ├── Servicio.js
│   │   ├── Mascota.js
│   │   ├── Solicitud.js
│   │   └── Opinion.js
│   ├── controllers/                 Validaciones y respuestas JSON
│   │   ├── authController.js
│   │   ├── servicioController.js
│   │   ├── mascotaController.js
│   │   ├── solicitudController.js
│   │   └── opinionController.js
│   ├── routes/
│   │   ├── index.js                 Registra todos los módulos
│   │   └── authRoutes.js, servicioRoutes.js, mascotaRoutes.js,
│   │       solicitudRoutes.js, opinionRoutes.js
│   └── database/
│       ├── schema.sql               Crea la base y las 5 tablas
│       ├── seed.sql                 Datos de arranque
│       └── generarHash.js           Genera un hash bcrypt a mano
│
└── frontend/
    └── src/
        ├── index.jsx                Monta la app y carga estilos globales
        ├── App.jsx                  Decide: login / registro / inicio
        ├── pages/
        │   ├── Login.jsx            Sección de acceso
        │   ├── Registro.jsx         Sección de registro
        │   └── Inicio.jsx           Solo arma las secciones en orden
        ├── sections/                Una sección = un archivo
        │   ├── Hero.jsx
        │   ├── Servicios.jsx
        │   ├── Mascotas.jsx
        │   ├── IngresoMascotas.jsx
        │   └── Opiniones.jsx
        ├── components/              Piezas reutilizables
        │   ├── Navbar.jsx, Footer.jsx, MascotaCard.jsx
        │   ├── Huella.jsx           Logo en SVG
        │   ├── Estrellas.jsx        Calificación (fija o editable)
        │   └── EstadoSeccion.jsx    Carga, error y aviso de datos demo
        ├── services/                Un servicio por sección
        │   ├── apiClient.js         Único punto que sabe la URL del backend
        │   ├── authService.js
        │   ├── serviciosService.js
        │   ├── mascotasService.js
        │   ├── solicitudesService.js
        │   └── opinionesService.js
        ├── hooks/useDatosSeccion.js Carga datos con respaldo automático
        ├── data/demo.js             Contenido de ejemplo sin base de datos
        └── styles/
            ├── tokens.css           Color, tipografía, espaciado
            ├── app.css              Formularios, esqueletos, modal
            ├── auth.css, navbar.css, footer.css
            └── secciones/           Un CSS por sección
                └── hero.css, servicios.css, mascotas.css,
                    ingreso.css, opiniones.css
```

---

## Instalación

### 1. Base de datos

Si todavía no tienes la base `mascotas` cargada, impórtala primero
(por ejemplo en phpMyAdmin: crear la base `mascotas` → pestaña
Importar → elegir tu archivo `mascotas.sql`), o desde la terminal:

```bash
mysql -u root -p -e "CREATE DATABASE mascotas CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -u root -p mascotas < mascotas.sql
```

Después, ejecuta la migración de este proyecto — agrega las columnas
y las dos tablas nuevas que la página necesita, **sin borrar nada**:

```bash
cd backend
mysql -u root -p mascotas < database/migracion_mascotas.sql
mysql -u root -p mascotas < database/seed_web.sql   # opcional, recomendado
```

`migracion_mascotas.sql` empieza con `SET NAMES utf8mb4;`. No lo
quites: sin esa línea, muchos clientes de MySQL (XAMPP, WAMP, la
consola de Windows) usan latin1 por defecto y guardan los acentos mal
— "Adopción" queda como "AdopciÃ³n".

`seed_web.sql` es opcional pero recomendado la primera vez: en tu
base, las 10 mascotas originales ya tienen una fila en `adopciones`,
así que sin este archivo el catálogo público sale vacío (todas
aparecen como adoptadas o en proceso). El seed agrega mascotas nuevas
sin adopción (= disponibles) y unas opiniones aprobadas, para que
todas las secciones tengan contenido real desde el primer arranque.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # ajusta DB_USER, DB_PASSWORD y DB_NAME=mascotas
npm run dev              # o: npm start
```

Queda en `http://localhost:4000`. Al arrancar dice si MySQL respondió.
Si algo falla, `http://localhost:4000/api/health` te dice qué.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # normalmente no hay que cambiar nada
npm run dev
```

Queda en `http://localhost:5173`. Crea tu cuenta desde la pantalla de
registro y entras directo.

---

## Cómo se conecta cada sección a la base de datos

Todas siguen el mismo camino:

```
sección (.jsx)  ->  servicio (services/)  ->  apiClient  ->  API
                                                             |
                    ruta  ->  controlador  ->  modelo  ->  MySQL
```

| Sección                 | Endpoint                 | Tablas de tu base `mascotas`                                    |
|--------------------------|---------------------------|-------------------------------------------------------------------|
| Login y Registro          | `/api/auth`               | `usuarios`                                                          |
| Hero (cifras)             | `/api/mascotas/resumen`   | `mascotas` + `adopciones`                                           |
| Servicios                 | `/api/servicios`          | `servicios`                                                         |
| Mascotas                  | `/api/mascotas`           | `mascotas` + `especies` + `razas` + `usuarios` + `adopciones`       |
| Tienda                    | `/api/productos`          | `productos` + `inventarios` + `proveedores`                        |
| Equipo                    | `/api/equipo`             | `veterinarios` + `empleados` + `usuarios`                          |
| Ingreso de mascotas        | `/api/solicitudes`        | `solicitudes_ingreso` *(nueva, la crea la migración)*              |
| Opiniones                  | `/api/opiniones`          | `opiniones` *(nueva, la crea la migración)*                        |
| Historial de adopciones    | `/api/adopciones`         | `adopciones`                                                        |

### Cómo se adaptó a tu base real

Tu base (`mascotas`) no se parecía a la que traía el proyecto
original, así que el backend se reescribió tabla por tabla. Lo más
importante:

- **`mascotas.estado`** en tu base es el estado de **salud**
  (`Saludable` / `En Tratamiento`). La *disponibilidad para adoptar*
  (disponible / en proceso / adoptada) que usa la página se calcula
  cruzando con la tabla `adopciones`: si hay una fila `Completada`,
  la mascota sale como adoptada; si no tiene ninguna fila, sale como
  disponible. Cambiar la disponibilidad desde la página nunca toca la
  columna de salud: escribe o borra filas en `adopciones`.
- **`id_especie` / `id_raza`** se resuelven con `JOIN` contra
  `especies` y `razas`, así que la ficha muestra "Labrador Retriever"
  en vez de un número. Si publicas una mascota con una especie o raza
  que todavía no existe, el backend la crea sobre la marcha.
- **`edad`** está en años en tu tabla; la página trabaja en meses. La
  conversión se hace en SQL con `TIMESTAMPDIFF` sobre
  `fecha_nacimiento` (o con `edad * 12` si no hay fecha).
- **Contraseñas en texto plano**: tus 10 usuarios originales tienen
  `pass1234` sin cifrar. El login los deja entrar con esa misma clave
  y, en esa misma petición, la reemplaza por un hash bcrypt — nadie
  tiene que cambiar su contraseña. También se puede convertir todas
  de una vez con `node database/hashearPasswords.js`.
- **`usuarios.role`** se expone como `rol` en toda la API, para no
  mezclar el nombre real de la columna con el que usa el resto del
  código.
- **Tienda y Equipo** son dos secciones nuevas: no existían en el
  proyecto original, pero tu base ya tenía las tablas
  (`productos`/`inventarios`/`proveedores` y
  `veterinarios`/`empleados`) sin ninguna pantalla que las mostrara.

**Funciona con o sin base de datos.** El hook `useDatosSeccion` recibe la
función que consulta la API y unos datos de respaldo. Si MySQL responde,
muestra datos reales. Si todavía no lo configuraste, muestra el contenido
de `data/demo.js` con un aviso discreto que nombra la tabla que falta.
Los datos de ejemplo tienen la misma forma que devuelven las tablas, así
que al cargar `seed.sql` las secciones cambian solas, sin tocar los
componentes.

---

## Endpoints

```
GET    /api/health                   Estado de la API y de MySQL

POST   /api/auth/registro            Crear cuenta
POST   /api/auth/login               Entrar
GET    /api/auth/sesion              ¿Hay sesión activa?
POST   /api/auth/logout              Salir

GET    /api/servicios                Listar
POST   /api/servicios                Crear            (requiere sesión)
PUT    /api/servicios/:id            Editar           (requiere sesión)
DELETE /api/servicios/:id            Retirar          (requiere sesión)

GET    /api/mascotas                 Listar. Filtros: ?especie= &estado= &limite=
GET    /api/mascotas/resumen         Conteo por estado
GET    /api/mascotas/:id             Detalle
POST   /api/mascotas                 Publicar         (requiere sesión)
PATCH  /api/mascotas/:id/estado      Cambiar estado   (requiere sesión)

POST   /api/solicitudes              Registrar una mascota (abierto)
GET    /api/solicitudes              Listar           (requiere sesión)
PATCH  /api/solicitudes/:id/estado   Revisar          (requiere sesión)

GET    /api/opiniones                Listar aprobadas + promedio
GET    /api/opiniones/pendientes     Listar sin aprobar (requiere sesión)
POST   /api/opiniones                Publicar         (requiere sesión)
PATCH  /api/opiniones/:id/aprobar    Aprobar          (requiere sesión)

GET    /api/productos                Listar. Filtros: ?limite=
GET    /api/productos/proveedores    Listar proveedores
GET    /api/productos/:id            Detalle
PATCH  /api/productos/:id/stock      Actualizar inventario (requiere sesión)

GET    /api/equipo                   Veterinarios + empleados + resumen
GET    /api/equipo/veterinarios      Solo veterinarios
GET    /api/equipo/empleados         Solo empleados. ?todos=1 incluye inactivos

GET    /api/adopciones               Historial. ?mias=1 (requiere sesión)
GET    /api/adopciones/resumen       Conteo por estado
POST   /api/adopciones               Registrar interés (requiere sesión)
```

Las opiniones nuevas entran con `aprobado = 0` y solo aparecen en la
página cuando alguien las aprueba.

---

## Cómo agregar una sección nueva

**Backend** — cuatro archivos:

1. La tabla en `database/schema.sql`
2. `models/MiCosa.js` con las consultas
3. `controllers/miCosaController.js` con las validaciones
4. `routes/miCosaRoutes.js`, y registrarlo en `routes/index.js`

**Frontend** — tres archivos:

1. `services/miCosaService.js`
2. `sections/MiCosa.jsx` usando `useDatosSeccion`
3. `styles/secciones/micosa.css`

Y añadir `<MiCosa />` en `pages/Inicio.jsx` y el enlace en
`components/Navbar.jsx`.

---

## Notas técnicas

- Las contraseñas se guardan con hash bcrypt, nunca en texto plano.
- La sesión va en una cookie `httpOnly` (`express-session`). El frontend
  usa `credentials: 'include'` para que la cookie viaje entre los
  puertos 5173 y 4000.
- Los filtros de mascotas se resuelven en el servidor (cláusula `WHERE`),
  no en el navegador, para que sigan funcionando cuando el catálogo crezca.
- Si una mascota no tiene `foto_url`, la ficha dibuja un retrato generado
  a partir de su nombre, para que el catálogo no se vea roto.
- Si vas a poner esto en producción con backend y frontend en dominios
  distintos, cambia `cookie.secure` a `true` en `server.js` y evalúa
  pasar de cookies de sesión a JWT.

---

## Verificado

- `npm run build` del frontend compila sin errores.
- `schema.sql` y `seed.sql` corren limpios en MySQL/MariaDB.
- Flujo completo probado contra MySQL real: registro, login, correo
  duplicado, contraseña incorrecta, sesión, logout, listado y filtro de
  mascotas, resumen, servicios, envío de solicitud y publicación de
  opinión.
- Sin MySQL, la API responde con mensajes claros y el frontend sigue
  mostrando contenido de ejemplo.
