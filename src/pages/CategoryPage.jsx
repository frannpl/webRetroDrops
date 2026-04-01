import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { jerseys } from '../data/jerseys';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap = {
    'todas': 'Todas',
    '2026-fifa-world-cup': '2026 FIFA World Cup',
    'retro': 'Retro',
    'la-liga': 'La Liga',
    'premier-league': 'Premier League',
    'bundesliga': 'Bundesliga',
    'serie-a': 'Serie A',
    'ligue-1': 'Ligue 1'
  };

  const selectedCategory = categoryMap[categoryId] || 'Todas';

  const filteredJerseys = useMemo(() => {
    // Mapping of teams to their leagues for robust filtering
    const leagueMapping = {
      'La Liga': ['Real Madrid', 'Barcelona', 'Barca', 'Atletico', 'Valencia', 'Athletic Bilbao', 'Sevilla', 'Real Sociedad', 'Betis', 'Villarreal', 'Rayo Vallecano', 'Mallorca', 'Getafe', 'Osasuna', 'Las Palmas', 'Alaves', 'Girona', 'Granada', 'Real Oviedo', 'Tenerife', 'Celta', 'Sporting Gijon', 'Murcia'],
      'Premier League': ['Manchester United', 'Man Utd', 'Manchester City', 'Man City', 'Liverpool', 'Arsenal', 'Chelsea', 'Tottenham', 'Spurs', 'Aston Villa', 'Newcastle', 'West Ham', 'Everton', 'Brighton', 'Leicester', 'Southampton', 'Wolves', 'Fulham', 'Nottingham Forest', 'Crystal Palace'],
      'Bundesliga': ['Bayern Munich', 'Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'Wolfsburg', 'Stuttgart', 'Eintracht Frankfurt', 'Hamburg', 'Werder Bremen', 'Schalke', 'Monchengladbach'],
      'Serie A': ['Juventus', 'Juv', 'Inter Milan', 'Internazionale', 'AC Milan', 'Roma', 'Lazio', 'Napoli', 'Fiorentina', 'Atalanta', 'Sassuolo', 'Torino', 'Bologna'],
      'Ligue 1': ['PSG', 'Paris Saint-Germain', 'Marseille', 'Olympique', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Rennes', 'Lens']
    };

    return jerseys.filter(j => {
      const matchesSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isRetroProduct = j.category === 'Retro' || j.name.toLowerCase().includes('retro');
      
      const leagues = Object.keys(leagueMapping);
      
      let matchesCategory = selectedCategory === 'Todas' || j.category === selectedCategory;

      // In "Todas", only show products synced with supplier album
      if (selectedCategory === 'Todas' && !j.supplierAlbum) {
        matchesCategory = false;
      }

      // Special handling for World Cup 2026
      if (!matchesCategory && selectedCategory === '2026 FIFA World Cup') {
        matchesCategory = j.id >= 17 && j.id <= 71;
      }

      // Special handling for Retro
      if (!matchesCategory && selectedCategory === 'Retro') {
        matchesCategory = j.category === 'Retro' || parseInt(j.year) < 2010;
      }

      // Special handling for Leagues
      if (!matchesCategory && leagues.includes(selectedCategory)) {
        const teamNames = leagueMapping[selectedCategory];
        matchesCategory = teamNames.some(team => j.name.toLowerCase().includes(team.toLowerCase())) || 
                          j.name.toLowerCase().includes(selectedCategory.toLowerCase());
      }

      // In league sections, show only current jerseys (exclude retro)
      if (leagues.includes(selectedCategory) && isRetroProduct) {
        matchesCategory = false;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [categoryId, searchTerm, selectedCategory]);

  return (
    <main className="pt-32 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-md">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.4em] mb-4 block underline decoration-amber-500 underline-offset-8">Categoría</span>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-neutral-900 italic">
              {selectedCategory}
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input 
                type="text" 
                placeholder="BUSCAR EN ESTA SECCIÓN..." 
                className="pl-12 pr-6 py-4 rounded-full text-[10px] font-bold bg-neutral-100 border-none w-64 focus:ring-2 focus:ring-amber-500 transition-all uppercase tracking-widest text-neutral-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Mostrando {filteredJerseys.length} resultados
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
          {filteredJerseys.length > 0 ? (
            filteredJerseys.map((jersey) => (
              <ProductCard key={jersey.id} jersey={jersey} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
               <p className="text-neutral-400 font-bold uppercase tracking-widest">No se encontraron productos en esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
