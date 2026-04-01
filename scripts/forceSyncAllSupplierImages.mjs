import fs from 'fs';
import { jerseys } from '../src/data/jerseys.js';

const all = [...jerseys];
const headers = { 'user-agent': 'Mozilla/5.0' };
const timeoutMs = 10000;
const withAlbum = [];

for (let i = 0; i < all.length; i += 1) {
  if (all[i].supplierAlbum) withAlbum.push(i);
}

function extractImages(html) {
  const medium = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/medium\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const small = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/small\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const dedupe = (arr) => [...new Set(arr)];
  if (medium.length) return dedupe(medium);
  if (small.length) return dedupe(small.map((u) => u.replace('/small.', '/medium.')));
  return [];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let pointer = 0;
let ok = 0;
let fail = 0;

async function worker() {
  while (pointer < withAlbum.length) {
    const pos = pointer;
    pointer += 1;
    const idx = withAlbum[pos];
    const item = all[idx];

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(item.supplierAlbum, { headers, signal: controller.signal });
      clearTimeout(timer);
      const html = await response.text();
      const imgs = extractImages(html);
      if (imgs.length) {
        all[idx] = { ...item, img: imgs[0], images: imgs };
        ok += 1;
      } else {
        fail += 1;
      }
    } catch {
      fail += 1;
    }

    if ((ok + fail) % 50 === 0) {
      console.log(`procesados ${ok + fail} | ok ${ok} | fail ${fail}`);
    }
    await sleep(120);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));

for (let i = 0; i < all.length; i += 1) {
  const item = all[i];
  if (item.img?.startsWith('/images/products/')) {
    const localPath = new URL(`../public${item.img}`, import.meta.url);
    if (!fs.existsSync(localPath)) {
      const fallback = `https://placehold.co/600x800/1a1a1a/eab308?text=${encodeURIComponent(item.name)}`;
      all[i] = { ...item, img: fallback, images: [fallback] };
    }
  }
}

fs.writeFileSync(
  new URL('../src/data/jerseys.js', import.meta.url),
  `export const jerseys = ${JSON.stringify(all, null, 2)};\n`,
  'utf8'
);

console.log(`final ok ${ok} | fail ${fail} | total ${withAlbum.length}`);
