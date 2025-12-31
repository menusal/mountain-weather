import React from 'react';
import type { TabType } from '../../types';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-lg">
      <button 
        onClick={() => onTabChange('localidad')}
        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${activeTab === 'localidad' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}
      >
        Poblaciones
      </button>
      <button 
        onClick={() => onTabChange('zona')}
        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${activeTab === 'zona' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}
      >
        Montaña
      </button>
    </div>
  );
};
