import React from 'react';
import { Mountain, Menu, X } from 'lucide-react';
import { Loader } from '../ui/Loader';

interface HeaderProps {
  loading: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ loading, isMenuOpen, onToggleMenu }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <Mountain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-sm uppercase tracking-tighter leading-none text-white">El tiempo en la montaña</h1>
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Directo AEMET</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {loading && <Loader />}
        <button 
          onClick={onToggleMenu}
          className="p-2.5 bg-slate-900 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};
