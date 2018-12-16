const puppeteer = require('puppeteer');
const express = require('express');
const { join, dirname } = require('path');
const { readFile, exists, writeFile, mkdir } = require('mz/fs');
const { uniq, difference } = require('lodash');

// Defining some configuration
const PORT = 4000;
const HOST = `http://localhost:${PORT}`;

let PAGES = [''];
let RENDERED_PAGES = [];

async function main() {
  const app = express();

  const index = (await readFile(join(process.cwd(), 'dist/simplyservers', 'index.html'))).toString();

  app.get('*.*', express.static(join(process.cwd(), 'dist/simplyservers')));
  app.get('*', (req, res) => res.send(index));

  // Starting the express server
  const server = await (new Promise((resolve, reject) => {
    const s = app.listen(PORT, e => e ? reject(e) : resolve(s));
  }));

  console.log('[SS] Started prerender server.');
  const browser = await puppeteer.launch();

  console.log(`[SS] Started prerender browser.`);
  const page = await browser.newPage();

  do {
    const p = PAGES[0];
    await page.goto(`${HOST}/${p}`);
    const result = await page.evaluate(() => document.documentElement.outerHTML);

    const file = join(process.cwd(), 'dist/prerender', (p || 'index') + '.html');

    const dir = dirname(file);

    if (!(await exists(dir)))
      await mkdir(dir);

    await writeFile(file, result);

    console.log('[SS] Prerender for  ' + file + " finished.");

    RENDERED_PAGES = [...RENDERED_PAGES, p];

    PAGES = difference(
      uniq(PAGES.concat(result.match(/href="\/[\/\w\d\-]*"/g).map(s => s.match(/\/([\/\w\d\-]*)/)[1]))),
      RENDERED_PAGES
    );

  } while (PAGES.length > 0);

  // Closes Chromium and finishes the express server.
  browser.close();
  server.close();
}

// Run the main asyn function
main()
  .then(() => console.log('[SS] Done prerendering.'))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
