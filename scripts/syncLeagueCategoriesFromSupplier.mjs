import fs from 'fs';
import { jerseys } from '../src/data/jerseys.js';

const leagueSources = [
  { category: 'La Liga', supplierCategoryId: '4879349', pages: 5 },
  { category: 'Premier League', supplierCategoryId: '4879426', pages: 1 },
  { category: 'Bundesliga', supplierCategoryId: '4879419', pages: 1 },
  { category: 'Serie A', supplierCategoryId: '4879582', pages: 2 },
  { category: 'Ligue 1', supplierCategoryId: '4880487', pages: 1 }
];

const headers = { 'user-agent': 'Mozilla/5.0' };

function normalizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function inferPrice(name, fallback = '55.00€') {
  const lower = name.toLowerCase();
  if (lower.includes('kids') || lower.includes('size:9-12') || lower.includes('16-28')) return '40.00€';
  if (lower.includes('shorts')) return '30.00€';
  if (lower.includes('training')) return '45.00€';
  if (lower.includes('player')) return '75.00€';
  if (lower.includes('long sleeve') || lower.includes('long-sleeved')) return '60.00€';
  return fallback;
}

function inferYear(name) {
  const fullYear = name.match(/\b(19\d{2}|20\d{2})\b/);
  if (fullYear) return fullYear[1];
  const season = name.match(/(\d{2})[\/_-](\d{2})/);
  if (season) {
    const first = Number(season[1]);
    return String(first >= 70 ? 1900 + first : 2000 + first);
  }
  return '2025';
}

function parseAlbumsFromHtml(html, supplierCategoryId) {
  const pattern = new RegExp(
    `title="([^"]+)"\\s*href="/albums/(\\d+)\\?uid=1&isSubCate=false&referrercate=${supplierCategoryId}"[\\s\\S]{0,900}?data-src="(https://photo\\.yupoo\\.com/[^"]+)"`,
    'gi'
  );

  const items = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const name = match[1].trim();
    const albumId = match[2];
    const smallSrc = match[3];
    if (!name || !albumId || !smallSrc) continue;
    items.push({ name, albumId, smallSrc });
  }
  return items;
}

const existingByName = new Map();
for (const product of jerseys) {
  existingByName.set(normalizeName(product.name), product);
}

const fetchedLeagueProducts = [];

for (const source of leagueSources) {
  for (let page = 1; page <= source.pages; page += 1) {
    const url = `https://simon-jerseys86.x.yupoo.com/categories/${source.supplierCategoryId}?page=${page}`;
    const response = await fetch(url, { headers });
    const html = await response.text();
    const albums = parseAlbumsFromHtml(html, source.supplierCategoryId);

    for (const album of albums) {
      const mediumSrc = album.smallSrc.replace('/small.', '/medium.');
      const normalized = normalizeName(album.name);
      const previous = existingByName.get(normalized);
      const fallbackPrice = previous?.price ?? '55.00€';

      fetchedLeagueProducts.push({
        name: album.name,
        category: source.category,
        price: inferPrice(album.name, fallbackPrice),
        img: mediumSrc,
        images: [mediumSrc],
        year: inferYear(album.name),
        edition: previous?.edition ?? 'Novedad',
        supplierAlbum: `https://simon-jerseys86.x.yupoo.com/albums/${album.albumId}?uid=1&isSubCate=false&referrercate=${source.supplierCategoryId}`,
        supplierCategoryId: source.supplierCategoryId
      });
    }
  }
}

const seenAlbums = new Set();
const uniqueLeagueProducts = [];
for (const item of fetchedLeagueProducts) {
  const albumId = item.supplierAlbum.match(/albums\/(\d+)/)?.[1] ?? item.name;
  if (seenAlbums.has(albumId)) continue;
  seenAlbums.add(albumId);
  uniqueLeagueProducts.push(item);
}

const leagueCategories = new Set(['La Liga', 'Premier League', 'Bundesliga', 'Serie A', 'Ligue 1']);
const preserved = jerseys.filter((p) => !leagueCategories.has(p.category));

const maxId = preserved.reduce((max, p) => Math.max(max, p.id), 0);
const rebuiltLeagues = uniqueLeagueProducts.map((item, index) => ({
  id: maxId + index + 1,
  ...item
}));

const nextCatalog = [...preserved, ...rebuiltLeagues];
fs.writeFileSync(
  new URL('../src/data/jerseys.js', import.meta.url),
  `export const jerseys = ${JSON.stringify(nextCatalog, null, 2)};\n`,
  'utf8'
);

console.log(
  JSON.stringify(
    {
      preserved: preserved.length,
      leagues: rebuiltLeagues.length,
      total: nextCatalog.length
    },
    null,
    2
  )
);
