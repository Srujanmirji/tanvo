#!/usr/bin/env node
/**
 * Compresses everything in public/images to a sane web size.
 *
 *   npm run images
 *
 * For each source image it writes a `.webp` (what almost every browser
 * will actually download) plus one fallback:
 *   - opaque images  → .jpg   (mozjpeg; far smaller than PNG for photos)
 *   - transparent    → .png   (palette-quantised)
 *
 * Originals are backed up to public/images/_original on first run, so
 * re-running never compounds compression artefacts. That folder is
 * gitignored — keep your masters somewhere else too.
 */
import { mkdir, readdir, copyFile, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');
const BACKUP_DIR = path.join(IMAGES_DIR, '_original');

/** Cards render ~400px wide; 900 covers a 2x display with headroom. */
const MAX_WIDTH = 900;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;
const sizeOf = async (p) => (existsSync(p) ? (await stat(p)).size : 0);

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`No such directory: ${IMAGES_DIR}`);
    process.exit(1);
  }

  await mkdir(BACKUP_DIR, { recursive: true });

  const entries = await readdir(IMAGES_DIR, { withFileTypes: true });
  const sources = entries
    .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
    .map((e) => e.name);

  if (!sources.length) {
    console.log('  Nothing to optimise.');
    return;
  }

  let before = 0;
  let after = 0;

  for (const name of sources) {
    const stem = name.replace(/\.(png|jpe?g)$/i, '');
    const filePath = path.join(IMAGES_DIR, name);
    const backupPath = path.join(BACKUP_DIR, name);

    if (!existsSync(backupPath)) await copyFile(filePath, backupPath);

    const originalSize = await sizeOf(backupPath);
    before += originalSize;

    const source = sharp(backupPath).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

    const { hasAlpha } = await sharp(backupPath).metadata();

    const webpPath = path.join(IMAGES_DIR, `${stem}.webp`);
    await source.clone().webp({ quality: 74, effort: 5 }).toFile(webpPath);

    let fallbackPath;
    if (hasAlpha) {
      fallbackPath = path.join(IMAGES_DIR, `${stem}.png`);
      await source
        .clone()
        .png({ compressionLevel: 9, palette: true, quality: 80 })
        .toFile(fallbackPath);
    } else {
      // Opaque artwork: JPEG beats PNG by an order of magnitude here.
      fallbackPath = path.join(IMAGES_DIR, `${stem}.jpg`);
      await source.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(fallbackPath);

      // Drop the now-redundant PNG so it cannot be deployed by accident.
      const stalePng = path.join(IMAGES_DIR, `${stem}.png`);
      if (existsSync(stalePng)) await unlink(stalePng);
    }

    const newSize = (await sizeOf(fallbackPath)) + (await sizeOf(webpPath));
    after += newSize;

    console.log(
      `  ${name.padEnd(18)} ${kb(originalSize).padStart(8)}  →  ${kb(
        await sizeOf(webpPath),
      ).padStart(7)} webp + ${kb(await sizeOf(fallbackPath)).padStart(7)} ${path
        .extname(fallbackPath)
        .slice(1)}`,
    );
  }

  const saved = ((1 - after / before) * 100).toFixed(0);
  console.log(`\n  Total ${kb(before)} → ${kb(after)}  (${saved}% smaller)\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
