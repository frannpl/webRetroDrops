import fs from 'fs';
import { jerseys } from '../src/data/jerseys.js';

const all = [...jerseys];
const retroIndexes = [];
for (let i = 0; i < all.length; i += 1) {
  if (all[i].category === 'Retro' && all[i].supplierAlbum) {
    retroIndexes.push(i);
  }
}

const headers = { 'user-agent': 'Mozilla/5.0' };

function extractImages(html) {
  const medium = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/medium\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const small = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/small\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const big = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/big\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);

  const dedupe = (arr) => [...new Set(arr)];
  if (medium.length) return dedupe(medium);
  if (small.length) return dedupe(small);
  return dedupe(big);
}

let pointer = 0;
let done = 0;
let ok = 0;
let fail = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function worker() {
  while (pointer < retroIndexes.length) {
    const current = pointer;
    pointer += 1;
    const index = retroIndexes[current];
    const jersey = all[index];

    try {
      let imgs = [];
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const response = await fetch(jersey.supplierAlbum, { headers });
        const html = await response.text();
        imgs = extractImages(html);
        if (imgs.length) break;
        await sleep(600 * (attempt + 1));
      }

      if (imgs.length) {
        all[index] = {
          ...jersey,
          img: imgs[0],
          images: imgs
        };
        ok += 1;
      } else {
        fail += 1;
      }
    } catch {
      fail += 1;
    }

    done += 1;
    if (done % 25 === 0) {
      console.log(`procesados ${done} | ok ${ok} | fail ${fail}`);
    }
    await sleep(220);
  }
}

await Promise.all(Array.from({ length: 3 }, worker));

fs.writeFileSync(
  new URL('../src/data/jerseys.js', import.meta.url),
  `export const jerseys = ${JSON.stringify(all, null, 2)};\n`,
  'utf8'
);

console.log(`final done ${done} | ok ${ok} | fail ${fail}`);
