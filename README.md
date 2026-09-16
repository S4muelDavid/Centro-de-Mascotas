# Huellitas · Centro de Adopción

Aplicación web de un refugio de mascotas. Backend en Node/Express con
arquitectura MVC, frontend en React (Vite), conectados a **tu base de
datos real `mascotas`** (la del volcado `mascotas.sql`, con las 11
tablas: usuarios, mascotas, especies, razas, adopciones, servicios,
productos, inventarios, proveedores, veterinarios y empleados).

Cada sección de la página está en su propio archivo y tiene su propia
ruta hacia la base de datos, así que se pueden trabajar por separado.


## Manual de usuario

Esta sección explica cómo usar la página ya en funcionamiento, sin
entrar en código. Está pensada para cualquier persona del refugio o
visitante que quiera adoptar, entregar una mascota o dejar su opinión.

### 1. Entrar al sitio

Al abrir la página (`http://localhost:5173` si la corres en tu
computador) siempre aparece primero la pantalla de acceso. No se puede
ver el catálogo ni ninguna otra sección sin una cuenta.

- **¿Ya tienes cuenta?** Escribe tu correo y contraseña en **Entra a
  tu cuenta** y pulsa **Entrar**.
- **¿Primera vez?** Pulsa **Créala aquí**, completa nombre, apellido,
  correo, teléfono (opcional) y una contraseña de mínimo 6 caracteres
  (la barra de abajo te dice qué tan fuerte es). Repite la contraseña
  y pulsa **Crear cuenta**. Quedas conectado de inmediato, sin pasos
  extra.
- Si el correo ya está registrado o la contraseña es incorrecta, la
  página te lo dice arriba del formulario para que corrijas.
- Mientras tengas la sesión abierta en el navegador, al volver a
  entrar a la página no te vuelve a pedir el login.

### 2. Moverse por el sitio

Ya dentro, la barra superior tiene un botón por cada apartado:
**Inicio, Servicios, Mascotas, Tienda, Equipo, Ingreso de mascotas y
Opiniones**. Al pulsar uno te lleva directo a esa sección completa —no
es scroll, es cambiar de página—. En pantallas pequeñas los mismos
enlaces se agrupan detrás del botón de menú (☰).

Arriba a la derecha ves tus iniciales y tu nombre, y el botón
**Cerrar sesión** para salir de la cuenta.

### 3. Inicio

Es la portada. Muestra un saludo con tu nombre y, en la "pizarra",
las cifras del refugio en tiempo real: cuántas mascotas buscan hogar,
cuántas están en proceso de adopción y cuántas ya tienen familia.
Desde aquí hay dos accesos directos: **Ver quién busca hogar** (te
lleva a Mascotas) y **Entregar una mascota** (te lleva a Ingreso de
mascotas).

### 4. Servicios

Lista lo que ofrece el refugio (por ejemplo, adopción responsable,
seguimiento veterinario, hogares de paso). Es solo informativa, no
requiere ninguna acción tuya.

### 5. Mascotas en adopción

El catálogo de animales disponibles.

- Usa los botones de arriba (**Todas**, **Perro**, **Gato**, etc.)
  para filtrar por especie.
- Cada ficha muestra nombre, raza, edad, sexo, tamaño, una breve
  descripción y si está esterilizada y vacunada.
- Si dice **"Ya tiene hogar"** o **"En proceso"**, el botón de adoptar
  queda desactivado: esa mascota ya no está disponible.
- Para las que sí están disponibles, pulsa **"Quiero conocer a
  [nombre]"**. Se abre una ventana con el correo
  (`hola@huellitas.org`) y el teléfono del refugio para que agendes la
  visita; menciona el nombre de la mascota al escribir.

### 6. Tienda

Catálogo de productos del refugio (alimento, accesorios, etc.), con
precio y disponibilidad real de inventario ("Disponible", "Stock
bajo" o "Agotado"). Arriba puedes escribir en el buscador para
filtrar por nombre de producto. Es solo para consultar: la compra se
coordina directamente con el refugio, no hay carrito en la página.

### 7. Equipo

Presenta a los veterinarios (con su especialidad) y al equipo humano
del refugio (con su cargo), para que sepas quién está detrás de cada
adopción. También es solo informativa.

### 8. Ingreso de mascotas

Para cuando tú tienes una mascota que necesita un nuevo hogar.

1. La sección explica primero, paso a paso, cómo funciona el proceso
   completo de principio a fin.
2. Abajo llenas el formulario: nombre de la mascota, especie, edad
   aproximada, su historia y estado de salud, y tus datos de contacto
   (nombre, teléfono y correo —estos dos últimos ya vienen
   diligenciados con los de tu cuenta, pero puedes cambiarlos—).
3. Al pulsar **Enviar solicitud** queda registrada como pendiente para
   que el equipo del refugio la revise; la página te confirma que se
   envió y limpia el formulario para que puedas registrar otra si
   quieres.

### 9. Opiniones

Aquí se leen y se publican las experiencias de quienes ya adoptaron.

- Arriba ves el promedio de calificación (en estrellas) y cuántas
  opiniones hay en total.
- Para dejar la tuya, pulsa **"Contar mi experiencia"**: escribe el
  nombre de la mascota que adoptaste (opcional), cuéntanos cómo fue el
  proceso y cómo está hoy, y elige tu calificación de 1 a 5 estrellas.
  Pulsa **Publicar opinión**.
- Tu opinión no aparece en la lista pública de inmediato: primero pasa
  por una revisión del equipo del refugio y solo se muestra una vez
  aprobada. Es normal no verla al instante.

### 10. Salir

Pulsa **Cerrar sesión** en la esquina superior derecha en cualquier
momento; te devuelve a la pantalla de acceso.

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
