# Íconos PWA para Workout Tracker

## Archivos necesarios

Esta aplicación requiere íconos PWA en los siguientes tamaños:

- `icon-72x72.png` - Android
- `icon-96x96.png` - Android
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Windows
- `icon-152x152.png` - iOS
- `icon-192x192.png` - Android/Chrome
- `icon-384x384.png` - Android
- `icon-512x512.png` - Todas las plataformas (requerido para instalar)

## Opción 1: Generar automáticamente (Recomendado)

1. Instalar sharp:
```bash
npm install sharp --save-dev
```

2. Ejecutar el script:
```bash
node public/icons/generate-icons.js
```

## Opción 2: Usar conversor online

1. Abrir `icon-source.svg` en un editor
2. Usar alguno de estos conversores:
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png
   - https://www.iloveimg.com/convert-to-png

3. Generar cada tamaño y guardar con el formato: `icon-{ANCHO}x{ALTO}.png`

## Opción 3: Crear manualmente

Puedes usar cualquier herramienta de diseño (Figma, Illustrator, Canva) para crear los íconos.

Recomendaciones:
- Formato: PNG con transparencia o fondo sólido
- Tamaño del canvas: cuadrado (1:1 ratio)
- Colores sugeridos: Azul (#3B82F6) con ícono blanco
- Bordes redondeados para mejor apariencia

## Verificación

Una vez creados los íconos, verifica que el build los incluye:

```bash
npm run build
ls -la dist/icons/
```

## Icono fuente

El archivo `icon-source.svg` contiene un diseño base con:
- Fondo con gradiente azul
- Ícono de mancuerna en blanco
- Bordes redondeados

Puedes modificar este SVG según tus preferencias antes de convertirlo.
