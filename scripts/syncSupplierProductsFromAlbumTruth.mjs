import fs from 'fs';
import { jerseys } from '../src/data/jerseys.js';

const headers = { 'user-agent': 'Mozilla/5.0' };
const timeoutMs = 10000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractAlbumTitle(html) {
  const dataNameMatch = html.match(/data-name="([^"]+)"/i);
  if (dataNameMatch?.[1]) return dataNameMatch[1].trim();
  const h1Match = html.match(/<h1[^>]*>\s*<span[^>]*>([^<]+)<\/span>/i);
  if (h1Match?.[1]) return h1Match[1].trim();
  return null;
}

function extractAlbumImages(html) {
  const medium = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/medium\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const small = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/small\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const dedupe = (arr) => [...new Set(arr)];
  if (medium.length) return dedupe(medium);
  if (small.length) return dedupe(small.map((u) => u.replace('/small.', '/medium.')));
  return [];
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const all = [...jerseys];
const indexes = [];
for (let i = 0; i < all.length; i += 1) {
  if (all[i].supplierAlbum) indexes.push(i);
}

let pointer = 0;
let ok = 0;
let fail = 0;
let renamed = 0;

async function worker() {
  while (pointer < indexes.length) {
    const current = pointer;
    pointer += 1;
    const idx = indexes[current];
    const item = all[idx];

    try {
      const response = await fetchWithTimeout(item.supplierAlbum);
      const html = await response.text();
      const title = extractAlbumTitle(html);
      const images = extractAlbumImages(html);

      if (title && images.length) {
        if (item.name !== title) renamed += 1;
        all[idx] = {
          ...item,
          name: title,
          img: images[0],
          images
        };
        ok += 1;
      } else {
        fail += 1;
      }
    } catch {
      fail += 1;
    }

    if ((ok + fail) % 100 === 0) {
      console.log(`procesados ${ok + fail} | ok ${ok} | fail ${fail} | renombrados ${renamed}`);
    }
    await sleep(120);
  }
}

await Promise.all(Array.from({ length: 3 }, worker));

fs.writeFileSync(
  new URL('../src/data/jerseys.js', import.meta.url),
  `export const jerseys = ${JSON.stringify(all, null, 2)};\n`,
  'utf8'
);

console.log(`final | total ${indexes.length} | ok ${ok} | fail ${fail} | renombrados ${renamed}`);
