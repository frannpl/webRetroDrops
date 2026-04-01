import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jerseys } from '../data/jerseys';
import { MessageCircle, ArrowLeft, ChevronRight, Share2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatEuro, getBasePrice, sizeSurcharge } from '../utils/pricing';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [withPatch, setWithPatch] = useState(false);
  const [withCustomization, setWithCustomization] = useState(false);
  const [customText, setCustomText] = useState('');

  const jersey = useMemo(() => {
    return jerseys.find(j => j.id === parseInt(productId));
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!jersey) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-black uppercase italic">Producto no encontrado</h2>
        <Link to="/" className="text-amber-600 font-bold uppercase tracking-widest mt-8 block hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  // Handle multiple images if they exist, otherwise use the single one
  const allImages = useMemo(() => {
    if (jersey.images && Array.isArray(jersey.images) && jersey.images.length > 0) {
      return jersey.images;
    }
    return [jersey.img];
  }, [jersey]);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const basePrice = getBasePrice(jersey);
  const selectedSizeSurcharge = sizeSurcharge(selectedSize);
  const extrasPrice = (withPatch ? 1 : 0) + (withCustomization ? 3 : 0);
  const finalPriceAmount = basePrice + selectedSizeSurcharge + extrasPrice;
  const finalPrice = formatEuro(finalPriceAmount);

  const handleWhatsApp = () => {
    const extras = [
      selectedSizeSurcharge > 0 ? `Recargo talla +${selectedSizeSurcharge}€` : null,
      withPatch ? 'Parche(s) +1€' : null,
      withCustomization ? `Personalización +3€${customText ? ` (${customText})` : ''}` : null
    ].filter(Boolean);
    const message = `Hola! Estoy interesado en la camiseta: ${jersey.name} (${jersey.year}). Talla: ${selectedSize || 'Por consultar'}. Extras: ${extras.length ? extras.join(', ') : 'Ninguno'}. Total: ${finalPrice}. ¿Está disponible?`;
    window.open(`https://wa.me/34635291700?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
          <Link to="/" className="hover:text-black">Inicio</Link>
          <ChevronRight size={10} />
          <Link to={`/category/${jersey.category.toLowerCase().replace(' ', '-')}`} className="hover:text-black">{jersey.category}</Link>
          <ChevronRight size={10} />
          <span className="text-neutral-900">{jersey.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Gallery Side */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden relative group">
              <img 
                src={allImages[selectedImage]} 
                alt={jersey.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
                  EDICIÓN {jersey.year}
                </span>
                <span className="bg-amber-500 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none shadow-xl shadow-amber-500/20">
                  {jersey.edition}
                </span>
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${jersey.name} view ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Side */}
          <div className="flex flex-col">
            <div className="mb-12 border-b border-neutral-100 pb-12">
              <span className="text-xs font-black text-amber-600 uppercase tracking-[0.5em] mb-6 block underline decoration-amber-500 underline-offset-8">
                {jersey.category}
              </span>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-neutral-950 mb-6">
                {jersey.name}
              </h1>
              <div className="text-4xl font-light tracking-tighter text-neutral-900">
                {finalPrice}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-3">
                Base {formatEuro(basePrice)}
                {selectedSizeSurcharge > 0 ? ` + talla ${formatEuro(selectedSizeSurcharge)}` : ''}
                {extrasPrice > 0 ? ` + extras ${formatEuro(extrasPrice)}` : ''}
              </p>
            </div>

            <div className="space-y-12 mb-12">
              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Seleccionar Talla</span>
                  <button className="text-[9px] font-black uppercase tracking-widest text-amber-600 hover:underline">Guía de Tallas</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 flex items-center justify-center text-xs font-black transition-all rounded-xl border-2 ${selectedSize === size ? 'bg-black border-black text-white' : 'bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Placeholder */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-6 block">Características</span>
                <p className="text-neutral-600 text-[11px] font-medium leading-loose uppercase tracking-[0.15em] max-w-lg">
                  Esta pieza exclusiva de {jersey.name} ({jersey.year}) representa lo mejor de la era {jersey.edition}. 
                  Fabricada con tejido técnico de alta gama y detalles bordados de máxima precisión, 
                  esta camiseta es una joya indispensable para cualquier coleccionista que valore la autenticidad y la historia del fútbol.
                </p>
              </div>

              {/* Add-ons */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-6 block">Extras</span>
                <div className="space-y-4">
                  <label className="flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Parche(s) de liga y competiciones</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-amber-600">+1€</span>
                      <input
                        type="checkbox"
                        checked={withPatch}
                        onChange={(e) => setWithPatch(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </div>
                  </label>

                  <label className="flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Personalización</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-amber-600">+3€</span>
                      <input
                        type="checkbox"
                        checked={withCustomization}
                        onChange={(e) => setWithCustomization(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </div>
                  </label>

                  {withCustomization && (
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Nombre y dorsal (opcional)"
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>

              {/* Service Grid */}
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-neutral-100">
                <div className="flex flex-col items-center text-center gap-3">
                  <ShieldCheck size={20} className="text-neutral-900" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Garantía<br/>Total</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 border-x border-neutral-100">
                  <Truck size={20} className="text-neutral-900" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Envío<br/>Premium</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <RefreshCw size={20} className="text-neutral-900" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Cambio<br/>De Talla</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4 mt-auto">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-green-600 text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-green-900/20 active:scale-[0.98]"
              >
                COMPRAR POR WHATSAPP <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Placeholder could go here */}
      </div>
    </main>
  );
};

export default ProductDetailPage;
