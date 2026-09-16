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

