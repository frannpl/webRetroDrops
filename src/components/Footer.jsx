import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-100 py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-2">
          <span className="text-3xl font-black tracking-tighter uppercase italic mb-10 block">
            RETRO<span className="text-amber-600">DROPS</span>OFICIAL
          </span>
          <p className="text-neutral-500 text-xs font-medium leading-loose uppercase tracking-[0.2em] max-w-sm">
            Especialistas en la curaduría de indumentaria deportiva clásica. No vendemos camisetas, entregamos nostalgia y calidad superior.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-10 text-center md:text-left">Social</h4>
          <div className="flex flex-col gap-6 text-xs font-black uppercase tracking-widest text-center md:text-left">
            <a
              href="https://www.instagram.com/retrodropsoficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 transition-colors flex items-center justify-center md:justify-start gap-2 italic uppercase"
            >
              Instagram <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.tiktok.com/@retrodropsoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 transition-colors flex items-center justify-center md:justify-start gap-2 italic uppercase"
            >
              TikTok <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-10 text-center md:text-left">Atención</h4>
          <p className="text-neutral-900 text-xs font-bold leading-relaxed text-center md:text-left uppercase tracking-widest mb-4">Lunes a Domingo</p>
          <p className="text-neutral-500 text-[10px] font-medium text-center md:text-left uppercase tracking-widest">Respuestas en menos de 1 hora</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.5em]">RETRODROPSOFICIAL © 2024 COLLECTION</span>
        <div className="flex gap-12 text-[9px] text-neutral-400 font-black uppercase tracking-[0.3em]">
          <span className="hover:text-black cursor-pointer transition-colors">Envíos</span>
          <span className="hover:text-black cursor-pointer transition-colors">Tallas</span>
          <span className="hover:text-black cursor-pointer transition-colors">Privacidad</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
