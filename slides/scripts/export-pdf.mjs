// Builds the deck, serves dist/ locally, and prints it to slides.pdf with the installed Chrome.
import { build, preview } from 'vite';
import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

await build({ logLevel: 'warn' });
const server = await preview({ preview: { port: 0, open: false } });
const url = server.resolvedUrls.local[0];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`${url}?print-pdf`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page');
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: 'slides.pdf',
    preferCSSPageSize: true,
    printBackground: true,
  });
  console.log('Wrote slides.pdf');
} finally {
  await browser.close();
  await server.close();
}
