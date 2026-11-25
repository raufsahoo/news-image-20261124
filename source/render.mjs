// Author-side tool: renders source/news.html to ../entry.png at 1024 x 1024 with a local headless Chrome or Edge.
// The entry itself (main.ts) only copies entry.png; nothing here runs in the grader.
//   node source/render.mjs [browser-path]
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const png = join(dir, '..', 'entry.png');
const browsers = [
  process.argv[2],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('no headless browser found; pass one as the first argument');

execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${png}`, pathToFileURL(join(dir, 'news.html')).href,
], { stdio: 'ignore' });

const size = statSync(png).size;
if (size > 1048576) throw new Error(`entry.png is ${size} bytes, over the 1 MiB limit`);
console.log(`entry.png: ${size} bytes`);
