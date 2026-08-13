#!/usr/bin/env node
/**
 * Visual check across breakpoints, driven by an already-installed
 * Chrome or Edge (no bundled browser download).
 *
 *   npm run dev                       # in one terminal
 *   npm run shots                     # in another
 *   npm run shots -- http://localhost:5174
 *
 * Writes PNGs to .screenshots/ and reports horizontal overflow per
 * breakpoint — a non-zero number there is always a layout bug.
 */
import { mkdirSync, existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = '.screenshots';

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error('  No Chrome or Edge found. Edit CANDIDATES in this script.');
  process.exit(1);
}

const SHOTS = [
  { name: '2xl-1920', path: '/', w: 1920, h: 1080 },
  { name: 'xl-1536', path: '/', w: 1536, h: 900 },
  { name: 'lg-1280', path: '/', w: 1280, h: 800 },
  { name: 'md-768', path: '/', w: 768, h: 1024 },
  { name: 'sm-390', path: '/', w: 390, h: 844 },
  { name: 'home-full', path: '/', w: 1600, h: 900, full: true },
  { name: 'admin', path: '/admin', w: 1440, h: 900 },
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

let failures = 0;

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.w, height: shot.h });
  await page.goto(BASE + shot.path, { waitUntil: 'networkidle2' });

  // Scroll through so IntersectionObserver reveals fire, then return.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));

  const metrics = await page.evaluate(() => {
    const d = document.documentElement;
    const probe = document.querySelector('.container-page');
    const r = probe?.getBoundingClientRect();
    return {
      overflow: d.scrollWidth - d.clientWidth,
      viewport: d.clientWidth,
      containerLeft: r ? Math.round(r.left) : null,
      containerWidth: r ? Math.round(r.width) : null,
    };
  });

  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: Boolean(shot.full) });

  const bad = metrics.overflow !== 0;
  if (bad) failures += 1;
  console.log(
    `  ${shot.name.padEnd(11)} ${String(shot.w).padStart(5)}px  ` +
      `container ${String(metrics.containerWidth).padStart(5)}px @ x=${String(metrics.containerLeft).padStart(4)}  ` +
      `overflow ${metrics.overflow}px ${bad ? '  ← BUG' : ''}`,
  );

  await page.close();
}

await browser.close();
console.log(`\n  ${SHOTS.length} shots written to ${OUT}/`);
if (failures) {
  console.error(`  ${failures} breakpoint(s) have horizontal overflow.`);
  process.exit(1);
}
