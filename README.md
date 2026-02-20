# Workout Tracker PWA

Aplicación PWA para seguimiento de entrenamientos, optimizada para dispositivos móviles con tema oscuro.

## Características

- ✅ Diseño mobile-first con tema oscuro
- ✅ Autenticación con Google (Firebase Auth)
- ✅ Sincronización en la nube (Firestore)
- ✅ Auto-guardado de entrenamientos en curso (localStorage)
- ✅ Recuperación automática de sesiones interrumpidas
- ✅ Rutinas personalizadas y entrenamiento libre
- ✅ Timer de descanso configurable
- ✅ Historial completo de entrenamientos
- ✅ Personal Records (PRs) automáticos
- ✅ Barra de navegación inferior tipo app nativa
- ✅ PWA instalable en Android/iOS
- ✅ Exportar/Importar datos en JSON

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build para Producción

```bash
npm run build
```

## Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar un archivo de test específico
npm test -- src/components/ComponentName.test.jsx

# Ejecutar tests por nombre
npm test -- -t "nombre del test"
```

## Configuración de Firebase

La aplicación usa Firebase para autenticación y base de datos en la nube.

### 1. Crear archivo `.env`

Copia `.env.example` a `.env` y completa con tus credenciales de Firebase:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Obtén estos valores en [Firebase Console](https://console.firebase.google.com) → Project Settings → General → Your apps.

### 2. Configurar Dominios Autorizados

Para que funcione el login con Google en GitHub Pages:

1. Ve a Firebase Console → Authentication → Settings → Authorized domains
2. Agrega: `matiasezrodriguez.github.io`
3. Guarda los cambios

## Despliegue en GitHub Pages

El despliegue se realiza automáticamente mediante **GitHub Actions**.

### Configurar GitHub Secrets

Antes del primer deploy, configura las variables de entorno como secrets:

1. Ve a tu repo en GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Crea los siguientes secrets (uno por uno):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Activar GitHub Pages

1. Ve a **Settings** → **Pages**
2. Cambia Source a **GitHub Actions**

### Deploy Manual

El deploy se activa automáticamente al hacer push a `master`. También puedes ejecutarlo manualmente:

1. Ve a **Actions** → **Deploy to GitHub Pages**
2. Clic en **"Run workflow"**

**⚠️ Importante:** No uses `npm run deploy` localmente, ya que expone las credenciales en el repositorio.

## Estructura del Proyecto

```
src/
  components/     # Componentes reutilizables
  pages/          # Páginas de la aplicación
  stores/         # Zustand stores (estado global)
  hooks/          # Custom hooks (autenticación)
  constants/      # Constantes (ejercicios predefinidos)
  utils/          # Utilidades (export/import)
  test/           # Configuración de tests
```

## Stack Tecnológico

- React 18 + Vite
- Tailwind CSS (mobile-first, dark theme)
- Zustand (estado)
- Firebase Firestore (persistencia)
- Firebase Auth (autenticación)
- Lucide React (iconos)
- date-fns (fechas)
- vite-plugin-pwa (PWA)

## Auto-guardado de Entrenamientos

La aplicación implementa un sistema de auto-guardado para entrenamientos en curso:

- Los cambios se guardan automáticamente en `localStorage`
- Si el usuario recarga la página o cierra el navegador por error, el entrenamiento se restaura automáticamente
- Al finalizar o cancelar un entrenamiento, el borrador se limpia
- El Dashboard muestra un aviso cuando hay un entrenamiento pendiente
