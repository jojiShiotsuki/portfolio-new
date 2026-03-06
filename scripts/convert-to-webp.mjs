import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

// Favicon/icon PNGs that must stay as PNG
const KEEP_AS_PNG = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
];

// Sprite PNGs in sprites/ subdirectory -- skip these
const SPRITES_DIR = path.join(PUBLIC_DIR, 'sprites');

async function convertPngsToWebp() {
  const files = fs.readdirSync(PUBLIC_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png') && !KEEP_AS_PNG.includes(f));

  console.log(`Found ${pngFiles.length} PNG files to convert in public/\n`);
  console.log('Skipping favicon/icon PNGs:', KEEP_AS_PNG.join(', '));
  console.log('---');

  let totalOriginal = 0;
  let totalWebp = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(PUBLIC_DIR, file.replace('.png', '.webp'));

    const originalSize = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const webpSize = fs.statSync(outputPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    totalOriginal += originalSize;
    totalWebp += webpSize;

    console.log(
      `${file}: ${(originalSize / 1024).toFixed(0)}KB -> ${(webpSize / 1024).toFixed(0)}KB (${savings}% smaller)`
    );
  }

  console.log('---');
  console.log(
    `TOTAL: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB -> ${(totalWebp / 1024 / 1024).toFixed(2)}MB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% smaller)`
  );
}

convertPngsToWebp().catch(console.error);
