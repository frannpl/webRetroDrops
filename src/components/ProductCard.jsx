import { MessageCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatEuro, getBasePrice } from '../utils/pricing';

const ProductCard = ({ jersey }) => {
  const displayPrice = formatEuro(getBasePrice(jersey));

  return (
    <div className="group relative">
      <Link to={`/product/${jersey.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 rounded-lg mb-8 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
          <img 
            src={jersey.img} 
            alt={`[Camiseta de ${jersey.name}]`} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/600x800/1a1a1a/eab308?text=${encodeURIComponent(jersey.name)}`;
            }}
          />
          
          {/* Etiquetas Premium */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
             <span className="bg-black/90 backdrop-blur text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">
               {jersey.year}
             </span>
          </div>
          <div className="absolute top-4 right-4">
             <span className="bg-amber-500 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg">
               {jersey.edition}
             </span>
          </div>
  
          {/* Overlay Interactivo */}
          <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-8 text-center">
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.3em] mb-6 lowercase">Ver Detalles</p>
              <div className="w-full bg-white text-black py-4 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                FICHA TÉCNICA <ExternalLink size={14} />
              </div>
          </div>
        </div>
      </Link>
      
      <div className="text-center">
        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.3em] mb-3 block">{jersey.category}</span>
        <h3 className="text-sm font-black uppercase tracking-tight mb-4 leading-tight group-hover:text-amber-600 transition-colors uppercase italic">{jersey.name}</h3>
        <div className="text-xl font-light tracking-tighter text-neutral-900">{displayPrice}</div>
      </div>
    </div>
  );
};

export default ProductCard;
