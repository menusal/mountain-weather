import React from 'react';

interface AvalancheBadgeProps {
  level: number;
}

const AvalancheBadge: React.FC<AvalancheBadgeProps> = ({ level }) => {
  const colors = ['bg-green-500', 'bg-yellow-400', 'bg-orange-500', 'bg-red-600', 'bg-purple-800'];
  const labels = ['Bajo (1)', 'Limitado (2)', 'Marcado (3)', 'Fuerte (4)', 'Muy Fuerte (5)'];
  const safeLevel = Math.min(Math.max(level || 1, 1), 5); // Ensure 1-5 range

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-inner">
      <div className={`${colors[safeLevel-1]} w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white/5`}>
        {safeLevel}
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Peligro Aludes (BPA)</p>
        <p className="text-lg font-bold text-white leading-tight">{labels[safeLevel-1]}</p>
      </div>
    </div>
  );
};

export default AvalancheBadge;
