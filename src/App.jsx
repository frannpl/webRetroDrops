import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { MessageCircle } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-100 flex flex-col">
        <Navbar />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
          </Routes>
        </div>

        <Footer />

        {/* --- WHATSAPP FLOATING --- */}
        <div className="fixed bottom-10 right-10 z-[70] group">
            <div className="absolute bottom-full right-0 mb-4 bg-white px-6 py-3 rounded-2xl shadow-2xl border border-neutral-100 text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
               ¿Alguna duda? Escríbenos
            </div>
            <a 
              href="https://wa.me/34635291700" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-6 rounded-full shadow-2xl shadow-green-900/20 hover:scale-110 active:scale-95 transition-all block"
            >
              <MessageCircle size={32} strokeWidth={2.5} />
            </a>
        </div>

        <Analytics />
      </div>
    </Router>
  );
};

export default App;
