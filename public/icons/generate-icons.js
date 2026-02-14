// Script para generar íconos PWA desde el SVG fuente
// Requiere: npm install sharp

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'icon-source.svg');
const outputDir = __dirname;

async function generateIcons() {
  try {
    const sharp = await import('sharp');
    const svgBuffer = fs.readFileSync(inputFile);

    console.log('Generando íconos PWA...\n');

    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp.default(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Generado: icon-${size}x${size}.png`);
    }

    console.log('\n✅ Todos los íconos generados exitosamente!');
    console.log('\n📁 Ubicación: public/icons/');
  } catch (error) {
    console.error('❌ Error generando íconos:', error.message);
    console.log('\n💡 Asegúrate de tener sharp instalado:');
    console.log('   npm install sharp --save-dev');
    process.exit(1);
  }
}

generateIcons();
