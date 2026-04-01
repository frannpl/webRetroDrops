const LEAGUE_CATEGORIES = new Set(['La Liga', 'Premier League', 'Bundesliga', 'Serie A', 'Ligue 1']);

export const sizeSurcharge = (size) => {
  const normalized = String(size || '').toUpperCase();
  if (normalized === 'XXL' || normalized === '2XL') return 1;
  if (normalized === '3XL') return 2;
  if (normalized === '4XL') return 3;
  return 0;
};

export const getBasePrice = (jersey) => {
  if (!jersey) return 0;
  if (jersey.category === 'Retro') return 30;
  if (LEAGUE_CATEGORIES.has(jersey.category)) return 25;
  if (jersey.category === 'Selecciones' && jersey.edition === 'Reliquia Mundial') return 30;

  return Number.parseFloat(String(jersey.price || '0').replace('€', '').replace(',', '.')) || 0;
};

export const formatEuro = (amount) => `${amount.toFixed(2)}€`;
