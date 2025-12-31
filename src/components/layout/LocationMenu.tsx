import React, { useState, useMemo } from 'react';
import { ChevronRight, X, Search, MapPin, Loader2 } from 'lucide-react';
import { ZONES } from '../../config/aemet';
import { useMunicipios } from '../../hooks/useWeather';
import type { LocationItem } from '../../types';

interface LocationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string, type: 'municipio' | 'montana') => void;
}

export const LocationMenu: React.FC<LocationMenuProps> = ({ isOpen, onClose, selectedId, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: municipios, isLoading, error } = useMunicipios();

  const filteredMunicipios = useMemo(() => {
    if (!municipios) return [];
    if (!searchQuery.trim()) return municipios.slice(0, 50); // Show first 50 by default

    const query = searchQuery.toLowerCase().trim();
    return municipios
      .filter(m => m.name.toLowerCase().includes(query))
      .slice(0, 50); // Limit to 50 for performance
  }, [municipios, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  if (!isOpen) return null;

  const renderButton = (item: LocationItem) => (
    <button 
      key={item.id}
      onClick={() => onSelect(item.id, item.type)}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
        selectedId === item.id 
          ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/30' 
          : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedId === item.id ? 'bg-white/20' : 'bg-slate-800'}`}>
           {item.type === 'montana' ? <MapPin size={14} className="text-blue-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
        </div>
        <span className="font-bold text-sm tracking-tight">{item.name}</span>
      </div>
      <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${selectedId === item.id ? 'text-white' : 'text-slate-600'}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/98 backdrop-blur-xl p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        <div className="flex justify-between items-center sticky top-0 bg-slate-950/0 py-2 z-10">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Ubicaciones</h2>
          <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-white cursor-pointer hover:bg-slate-800 transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Buscar municipio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>
        
        {/* Mountain Zones (Prioritized) */}
        {!searchQuery && (
          <section className="space-y-4">
            <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] px-1">Zonas de Montaña</h3>
            <div className="grid gap-3">
              {ZONES.map(renderButton)}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {searchQuery ? 'Resultados de búsqueda' : 'Municipios Destacados'}
            </h3>
            {!searchQuery && municipios && (
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                {municipios.length} disponibles
              </span>
            )}
          </div>
          
          <div className="grid gap-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Cargando base de datos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 bg-red-500/5 rounded-3xl border border-red-500/10 p-6">
                <p className="text-red-400 text-xs font-bold">Error al cargar municipios</p>
              </div>
            ) : filteredMunicipios.length > 0 ? (
              filteredMunicipios.map(renderButton)
            ) : (
              <div className="text-center py-20 space-y-3">
                <Search size={32} className="mx-auto text-slate-800" />
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No se encontraron resultados</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
