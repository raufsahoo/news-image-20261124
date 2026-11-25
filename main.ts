// news-image-20261124 entry: one image summing up the world news of Tuesday 24 November 2026.
// entry.png ships in the repository (rendered from source/news.html); this Node 22 program copies it to /output.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const png = readFileSync(new URL('./entry.png', import.meta.url));

// Same limits as the gate: a whole PNG, at most 1 MiB and 1024 x 1024 pixels.
const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];
if (!png.subarray(0, 8).equals(magic)) throw new Error('entry.png is not a PNG');
if (png.length > 1048576) throw new Error(`entry.png is ${png.length} bytes`);
if (w > 1024 || h > 1024) throw new Error(`entry.png is ${w}x${h}`);
if (png.subarray(-8, -4).toString('latin1') !== 'IEND') throw new Error('entry.png is truncated');

writeFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'), png);
