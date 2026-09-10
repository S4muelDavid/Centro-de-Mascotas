# Huellitas - Login MVC (Node + MySQL) conectado a React (index.jsx)

Proyecto completo, armado desde cero con arquitectura **Modelo-Vista-Controlador**
en el backend, y un frontend en React cuyo `index.jsx` ya está conectado al
login vía la API.

## Estructura

```
adopcion-login-full/
├── backend/                    # API en Node/Express (MVC)
│   ├── server.js                 # Punto de entrada
│   ├── config/db.js               # Conexión (pool) a MySQL
│   ├── models/Usuario.js          # Modelo: consultas SQL
│   ├── controllers/authController.js  # Controlador: lógica de login
│   ├── routes/authRoutes.js       # Rutas /api/auth/*
│   ├── database/schema.sql        # Crea la BD y la tabla "usuarios"
│   ├── database/generarHash.js    # Genera un hash bcrypt de prueba
│   └── .env.example
│
└── frontend/                   # React (Vite)
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── index.jsx              # Punto de entrada de React
        ├── App.jsx                # Decide Login vs Bienvenida según la sesión
        ├── pages/Login.jsx        # Formulario conectado a POST /api/auth/login
        ├── pages/Bienvenida.jsx   # Vista placeholder tras iniciar sesión
        └── styles/login.css       # CSS puro, diseño Huellitas
```

## Cómo quedaron conectados backend y frontend

- El `index.jsx` monta `<App />`, que al cargar consulta
  `GET /api/auth/sesion` para saber si ya hay sesión activa.
- Si no hay sesión, se muestra `Login.jsx`, que envía
  `POST /api/auth/login` con `correo` y `password`.
- El backend valida contra MySQL (`bcryptjs` para comparar el hash) y,
  si es correcto, guarda `usuario` en una cookie de sesión (`express-session`).
- El frontend usa `fetch(..., { credentials: 'include' })` para que esa
  cookie viaje entre `localhost:5173` (React) y `localhost:4000` (API).

## Instalación y ejecución

**1. Backend**
```
cd backend
npm install
cp .env.example .env      # y ajusta tus credenciales de MySQL
```
Crea la base ejecutando `database/schema.sql` en tu servidor MySQL.
Luego genera un usuario de prueba:
```
node database/generarHash.js
```
Copia el hash resultante en el `INSERT` comentado dentro de `schema.sql`
y ejecútalo. Después arranca el servidor:
```
npm run dev      # o: npm start
```
Quedará corriendo en `http://localhost:4000`.

**2. Frontend**
```
cd frontend
npm install
cp .env.example .env      # normalmente no necesitas cambiar nada
npm run dev
```
Quedará corriendo en `http://localhost:5173`. Abre esa URL y verás
el login ya funcionando contra el backend.

## ⚠️ Lo que me falta para ajustarlo 100% a tu proyecto real

No llegué a recibir el **encarpetado base** que mencionaste, así que tuve
que tomar decisiones por mi cuenta. Antes de darlo por terminado, dime si
alguno de estos puntos no coincide con lo que ya tienes:

1. **Tu `index.jsx` original**: no lo compartiste, así que construí uno
   nuevo desde cero (con `App.jsx`, `Login.jsx`, `Bienvenida.jsx`). Si ya
   tenías un `index.jsx` con otra estructura (rutas con React Router,
   Redux/Context, otro bundler que no sea Vite, etc.), dímelo para
   adaptarlo en vez de reemplazarlo.
2. **Nombre y campos reales de la tabla de usuarios**: asumí `usuarios`
   con `id, nombre, correo, password`. Si tu tabla ya existe con otros
   nombres de columna (o con roles, ej. admin/voluntario/adoptante),
   lo ajusto.
3. **Manejo de sesión vs. token**: usé cookies de sesión
   (`express-session`). Si tu backend real va a vivir en un dominio
   distinto al frontend en producción, puede convenir más usar JWT en
   vez de cookies — dime si es ese el caso.
4. **Puertos y nombres de carpeta**: usé `backend/` (puerto 4000) y
   `frontend/` (puerto 5173) como convención. Si tu proyecto ya tiene
   nombres de carpeta definidos (por ejemplo `server/`, `client/`, o
   todo junto en un solo `package.json`), lo reorganizo.
5. **Registro de usuarios**: dejé el modelo listo con un método `crear`,
   pero no construí la pantalla de registro (el enlace "Regístrate aquí"
   no hace nada todavía). Dime si lo necesitas ya.
6. **Vista tras el login**: `Bienvenida.jsx` es solo un placeholder.
   Si ya tienes un dashboard o listado de mascotas en el proyecto
   original, lo conecto ahí en vez de mostrar esta pantalla genérica.

Envíame el zip de tu proyecto real (o dime qué de lo anterior corregir)
y ajusto todo para que encaje exacto.
