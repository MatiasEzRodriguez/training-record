# Workout Tracker PWA

Aplicación PWA para seguimiento de entrenamientos, optimizada para dispositivos móviles con tema oscuro.

## Características

- ✅ Diseño mobile-first con tema oscuro
- ✅ Guardado automático en localStorage
- ✅ Exportar/Importar datos en JSON
- ✅ Rutinas personalizadas y entrenamiento libre
- ✅ Timer de descanso configurable
- ✅ Historial completo de entrenamientos
- ✅ Barra de navegación inferior tipo app nativa
- ✅ PWA instalable en Android/iOS

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
  pages/         # Páginas de la aplicación
  stores/        # Zustand stores
  constants/     # Constantes (ejercicios predefinidos)
  utils/         # Utilidades (export/import)
  test/          # Configuración de tests
```

## Stack Tecnológico

- React 18 + Vite
- Tailwind CSS (mobile-first, dark theme)
- Zustand (estado)
- Lucide React (iconos)
- date-fns (fechas)
- uuid (IDs únicos)
- vite-plugin-pwa (PWA)

## Licencia

MIT
