// Saves one PNG per slide (1920x1080) from a running dev server, for layout checks.
// usage: node scripts/screenshots.mjs [url] [outdir]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'http://localhost:5173/';
const out = process.argv[3] || 'shots';
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.deck && window.deck.isReady());
  const n = await page.evaluate(() => window.deck.getTotalSlides());
  for (let i = 0; i < n; i++) {
    await page.evaluate((k) => window.deck.slide(k), i);
    await new Promise((r) => setTimeout(r, 150));
    await page.screenshot({ path: `${out}/slide-${String(i + 1).padStart(2, '0')}.png` });
  }
  console.log(`Wrote ${n} screenshots to ${out}/`);
} finally {
  await browser.close();
}
