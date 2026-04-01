import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLigasOpen, setIsLigasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainCategories = [
    { name: "Todas", path: "/category/todas" },
    { name: "2026 FIFA World Cup", path: "/category/2026-fifa-world-cup" },
    { name: "Retro", path: "/category/retro" }
  ];

  const leagues = [
    { name: "La Liga", path: "/category/la-liga" },
    { name: "Premier League", path: "/category/premier-league" },
    { name: "Bundesliga", path: "/category/bundesliga" },
    { name: "Serie A", path: "/category/serie-a" },
    { name: "Ligue 1", path: "/category/ligue-1" }
  ];

  const otherCategories = [];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || location.pathname !== '/' ? 'bg-white/95 backdrop-blur-md py-4 shadow-xl shadow-black/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className={`text-2xl font-black tracking-tighter uppercase italic transition-colors duration-500 ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-neutral-900'}`}>
              RETRO<span className="text-amber-500 underline decoration-2 underline-offset-4">DROPS</span>OFICIAL
            </span>
          </Link>

          <div className={`hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${scrolled || location.pathname !== '/' ? 'text-neutral-500' : 'text-neutral-300'}`}>
            {mainCategories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.path}
                className={`hover:text-amber-500 transition-colors ${location.pathname === cat.path ? 'text-amber-500' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
            
            <div className="relative group" onMouseEnter={() => setIsLigasOpen(true)} onMouseLeave={() => setIsLigasOpen(false)}>
              <button className={`hover:text-amber-500 transition-colors flex items-center gap-1`}>
                LIGAS <ChevronRight size={10} className={`transform transition-transform ${isLigasOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isLigasOpen && (
                <div className="absolute top-full left-0 pt-4 w-48 z-[60]">
                  <div className="bg-white shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 border border-neutral-100">
                    {leagues.map(league => (
                      <Link
                        key={league.name}
                        to={league.path}
                        onClick={() => setIsLigasOpen(false)}
                        className="w-full text-left px-6 py-4 text-[9px] font-black hover:bg-neutral-50 hover:text-amber-600 transition-colors border-b border-neutral-50 last:border-none block"
                      >
                        {league.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {otherCategories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.path}
                className={`hover:text-amber-500 transition-colors ${location.pathname === cat.path ? 'text-amber-500' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${scrolled || location.pathname !== '/' ? 'text-neutral-300' : 'text-neutral-500'}`} size={14} />
              <input 
                type="text" 
                placeholder="BUSCAR MODELO..." 
                className={`pl-10 pr-4 py-2 rounded-full text-[10px] font-bold border-none transition-all w-44 ${scrolled || location.pathname !== '/' ? 'bg-neutral-100 focus:ring-1 focus:ring-amber-500' : 'bg-white/10 text-white placeholder:text-neutral-400 focus:bg-white/20'}`}
              />
            </div>
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} className={scrolled || location.pathname !== '/' ? 'text-black' : 'text-white'} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-neutral-950 z-[60] flex flex-col p-12 overflow-y-auto animate-in fade-in duration-300">
          <div className="flex justify-end mb-12">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              <X size={32} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {mainCategories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter text-left text-white hover:text-amber-500 transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600">Ligas</span>
              <div className="grid grid-cols-2 gap-4">
                {leagues.map(league => (
                  <Link 
                    key={league.name}
                    to={league.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold uppercase tracking-tighter text-left text-neutral-400 hover:text-white transition-colors"
                  >
                    {league.name}
                  </Link>
                ))}
              </div>
            </div>

            {otherCategories.map(cat => (
              <Link 
                key={cat.name} 
                to={cat.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter text-left text-white hover:text-amber-500 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
