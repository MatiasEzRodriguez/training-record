# Workout Tracker PWA

Aplicación PWA para seguimiento de entrenamientos, optimizada para dispositivos móviles con tema oscuro.

## Características

- ✅ Diseño mobile-first con tema oscuro
- ✅ Persistencia de datos con Firebase Firestore
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

## Despliegue en GitHub Pages

La aplicación está configurada para desplegarse en GitHub Pages. El archivo `vite.config.js` tiene la propiedad `base` configurada como `/training-record/`.

Para desplegar:

1. Asegúrate de que el repositorio se llame `training-record`
2. Ejecuta `npm run build`
3. Sube la carpeta `dist` a la rama `gh-pages`

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
