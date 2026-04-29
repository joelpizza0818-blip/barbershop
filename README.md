# ✂️ Classic Barbershop

Aplicación web completa para una barbería premium. Incluye landing page con sistema de reservas de citas, autenticación de usuarios (registro/login con JWT) y panel de perfil personal.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (Web Components) |
| **Backend** | Node.js + Express v5 |
| **Base de datos** | Microsoft SQL Server (via `mssql` + `msnodesqlv8`) |
| **Autenticación** | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` |
| **Tipografías** | Playfair Display, Manrope (Google Fonts) |

---

## 📁 Estructura del proyecto

```
barbershop/
├── .env                        # Variables de entorno (NO subir a git)
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── db.js                       # Conexión a SQL Server (singleton)
├── server.js                   # Entrada del servidor Express
├── package.json
├── toda mi base de datos.sql   # Esquema y datos de la base de datos
│
└── proyect/
    ├── controllers/
    │   ├── authController.js   # Lógica de registro y login
    │   └── citasController.js  # Lógica de agendar y ver citas
    │
    ├── middleware/
    │   └── verificartoken.js   # Validación de JWT
    │
    ├── models/
    │   ├── userModel.js        # Queries de la tabla Users
    │   └── citasModel.js       # Queries de la tabla Citas
    │
    ├── routers/
    │   ├── authRoutes.js       # Rutas /api/registro y /api/login
    │   └── citasRoutes.js      # Rutas /api/agendar y /api/miscitas
    │
    └── public/
        ├── css/
        │   ├── global.css      # Sistema de diseño global (tokens, header, footer, animaciones)
        │   ├── style.css       # Estilos específicos del index
        │   ├── services.css    # Estilos de la página de servicios
        │   ├── nosotros.css    # Estilos de la página nosotros
        │   └── contacto.css    # Estilos de la página de contacto
        │
        ├── js/
        │   ├── animations.js           # Scroll reveal, hamburger menu, smooth scroll
        │   ├── perfil-component.js     # Web Component: modal de perfil/login/registro
        │   └── reserva-component.js    # Web Component: modal de reserva de citas
        │
        └── src/
            ├── index.html      # Página principal (hero, servicios, testimonios)
            ├── services.html   # Página de servicios detallada
            ├── nosotros.html   # Página de equipo y valores
            └── contacto.html   # Página de contacto
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd barbershop
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y rellena tus valores:

```bash
cp .env.example .env
```

Edita `.env`:

```env
DB_SERVER=TU_SERVIDOR\INSTANCIA   # Ej: DESKTOP-AAHT4C4\HOLA
DB_NAME=barberia
JWT_SECRET=una_clave_secreta_larga_y_segura
PORT=3000
```

### 4. Configurar la base de datos

Ejecuta el archivo SQL en tu instancia de SQL Server:

```bash
# Desde SQL Server Management Studio:
# Archivo → Abrir → "toda mi base de datos.sql"
```

---

## 🚀 Correr el proyecto

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

Para ver el frontend, abre directamente en el navegador:
```
proyect/public/src/index.html
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| `POST` | `/api/registro` | Crear cuenta nueva | ❌ |
| `POST` | `/api/login` | Iniciar sesión | ❌ |

**Body de `/api/registro`:**
```json
{
  "name": "Carlos Mendoza",
  "email": "carlos@correo.com",
  "password": "miPassword123"
}
```

**Body de `/api/login`:**
```json
{
  "email": "carlos@correo.com",
  "password": "miPassword123"
}
```

### Citas

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| `POST` | `/api/agendar` | Crear nueva cita | ✅ JWT |
| `GET` | `/api/miscitas` | Ver mis citas | ✅ JWT |

**Header requerido para rutas protegidas:**
```
Authorization: <token>
```

**Body de `/api/agendar`:**
```json
{
  "name": "Carlos Mendoza",
  "service": "Corte Clásico",
  "date": "2026-05-15",
  "time": "10:30:00"
}
```

---

## 🔒 Seguridad

- Las contraseñas se hashean con **bcryptjs** (salt rounds: 10)
- Los tokens JWT expiran en **24 horas**
- El `JWT_SECRET` se lee desde variables de entorno (nunca hardcodeado)
- El archivo `.env` está en `.gitignore` para no exponerse en el repositorio

---

## 📝 Notas de desarrollo

- El frontend usa **Web Components nativos** (sin frameworks)
- El componente `perfil-component.js` maneja login, registro y perfil de usuario en un solo modal
- El componente `reserva-component.js` maneja el formulario de citas con llamada a la API
- Las animaciones de scroll usan `IntersectionObserver` nativo
