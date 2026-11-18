import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/assets/images';
const WIDTHS = [400, 800];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const files = await fs.readdir(INPUT_DIR);
const imageFiles = files.filter((file) => /\.(jpe?g|png|webp)$/i.test(file));

for (const file of imageFiles) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);

  for (const width of WIDTHS) {
    const resized = sharp(inputPath).resize({ width, withoutEnlargement: true });

    await resized
      .clone()
      .avif({ quality: 65 })
      .toFile(path.join(OUTPUT_DIR, `${name}-${width}.avif`));

    await resized
      .clone()
      .webp({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, `${name}-${width}.webp`));
  }

  await sharp(inputPath)
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUTPUT_DIR, `${name}-800.jpg`));

  console.log(`Processed: ${name}`);
}