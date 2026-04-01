import React, { useMemo } from 'react';
import { Award, Truck, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { jerseys } from '../data/jerseys';

const HomePage = () => {
  // Solo productos sincronizados con el proveedor (misma fuente nombre + imagen)
  const featured = useMemo(
    () => jerseys.filter((j) => j.supplierAlbum).slice(0, 8),
    []
  );

  return (
    <main>
      {/* --- HERO --- */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Estadio retro"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-7xl md:text-[10rem] font-black mb-8 tracking-[-0.07em] leading-[0.8] text-white">
            VIVE LA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">HISTORIA.</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-lg max-w-xl mx-auto mb-14 uppercase tracking-[0.2em] leading-relaxed font-medium">
            Piezas de museo para el coleccionista moderno. Calidad G5 artesanal.
          </p>
          <a href="/category/todas" className="bg-white text-black px-14 py-6 rounded-full font-black text-[10px] tracking-[0.3em] hover:bg-amber-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 inline-block">
            VER CATÁLOGO
          </a>
        </div>
      </section>

      {/* --- QUALITY PROMISE --- */}
      <section className="bg-neutral-50 py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { icon: <Award size={40} />, title: "Calidad G5+", desc: "Nuestras réplicas utilizan los mismos materiales y técnicas de tejido que las originales." },
            { icon: <Truck size={40} />, title: "Logística VIP", desc: "Envío express con número de seguimiento y seguro de pérdida incluido." },
            { icon: <ShieldCheck size={40} />, title: "Pago Seguro", desc: "Transacciones protegidas y asesoramiento directo 1 a 1 por WhatsApp." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="text-amber-600 mb-8 transform transition-transform group-hover:-translate-y-2 duration-500">
                {item.icon}
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4">{item.title}</h4>
              <p className="text-neutral-500 text-xs leading-loose font-medium px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
          <div className="max-w-md">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.4em] mb-4 block">Selection</span>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none text-neutral-900">
              LANZAMIENTOS <br />DESTACADOS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
          {featured.map((jersey) => (
            <ProductCard key={jersey.id} jersey={jersey} />
          ))}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden bg-black text-white p-12 md:p-24">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-[0.9]">¿CÓMO TENER LA TUYA?</h3>
                    <div className="space-y-10">
                        {[
                          { step: "01", text: "Haz captura de tu reliquia favorita del catálogo." },
                          { step: "02", text: "Envíanos un mensaje directo por WhatsApp indicando tu talla." },
                          { step: "03", text: "Recibe asesoramiento experto y confirma tu pedido seguro." }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-6 group">
                            <span className="text-amber-500 text-2xl font-black italic tracking-tighter group-hover:scale-110 transition-transform">{item.step}</span>
                            <p className="text-sm md:text-base text-neutral-400 font-medium leading-relaxed pt-1 uppercase tracking-widest">{item.text}</p>
                          </div>
                        ))}
                    </div>
                </div>
                <div className="relative w-full aspect-[4/3] lg:aspect-square mt-8 lg:mt-0 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-amber-500/20">
                    <img
                      src="/images/home-como-pedir-visual.png"
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                      alt="Camisetas retro y envío: calidad de catálogo y entrega a domicilio"
                      loading="lazy"
                      decoding="async"
                    />
                </div>
            </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
