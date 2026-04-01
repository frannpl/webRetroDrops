import fs from 'fs';
import { jerseys } from '../src/data/jerseys.js';

const headers = { 'user-agent': 'Mozilla/5.0' };
const timeoutMs = 8000;

function existsLocal(path) {
  return fs.existsSync(new URL(`../public${path}`, import.meta.url));
}

async function checkRemote(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'GET', headers, signal: controller.signal });
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function extractAlbumImages(html) {
  const medium = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/medium\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const small = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/small\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const big = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'\s>]+\/big\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const dedupe = (arr) => [...new Set(arr)];
  if (medium.length) return dedupe(medium);
  if (small.length) return dedupe(small.map((u) => u.replace('/small.', '/medium.')));
  return dedupe(big.map((u) => u.replace('/big.', '/medium.')));
}

async function imageIsValid(url) {
  if (!url) return false;
  if (url.startsWith('/')) return existsLocal(url);
  if (!/^https?:\/\//.test(url)) return false;
  if (url.includes('placehold.co')) return false;
  return checkRemote(url);
}

const updated = [];
let missingBefore = 0;
let fixed = 0;
let stillMissing = 0;

for (const product of jerseys) {
  const urls = [product.img, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean);
  let valid = false;
  for (const url of urls) {
    if (await imageIsValid(url)) {
      valid = true;
      break;
    }
  }

  if (valid) {
    updated.push(product);
    continue;
  }

  missingBefore += 1;
  let repaired = false;

  if (product.supplierAlbum) {
    try {
      const response = await fetch(product.supplierAlbum, { headers });
      const html = await response.text();
      const albumImages = extractAlbumImages(html);
      if (albumImages.length) {
        updated.push({
          ...product,
          img: albumImages[0],
          images: albumImages
        });
        fixed += 1;
        repaired = true;
      }
    } catch {
      // keep as missing
    }
  }

  if (!repaired) {
    updated.push(product);
    stillMissing += 1;
  }
}

fs.writeFileSync(
  new URL('../src/data/jerseys.js', import.meta.url),
  `export const jerseys = ${JSON.stringify(updated, null, 2)};\n`,
  'utf8'
);

console.log(JSON.stringify({ total: jerseys.length, missingBefore, fixed, stillMissing }, null, 2));
