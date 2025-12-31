import React from 'react';
import { Info, History, MapPin, ShieldAlert } from 'lucide-react';
import type { WeatherData } from '../../types';

interface WeatherMountainViewProps {
  weather: WeatherData | null;
  nivologica: WeatherData | null;
  activeName: string;
}

export const WeatherMountainView: React.FC<WeatherMountainViewProps> = ({ weather, nivologica, activeName }) => {
  const sections = weather?.seccion || [];
  const predictionText = weather?.prediccion?.texto?.propia || weather?.texto?.propia;

  // Nivológica sections often contain the risk level
  const nivoSections = nivologica?.seccion || [];

  // Helper to parse danger levels from plain text
  const parseDangerLevels = (text: string) => {
    if (!text) return null;
    const sectionStart = text.indexOf('1.- Estimación del nivel de peligro:');
    if (sectionStart === -1) return null;
    
    const nextSectionStart = text.indexOf('2.- Estado del manto', sectionStart);
    const dangerSection = text.slice(sectionStart, nextSectionStart !== -1 ? nextSectionStart : undefined);
    
    const lines = dangerSection.split('\n').slice(2);
    const results: { area: string; description: string; levels: number[] }[] = [];
    let currentArea: { area: string; description: string; levels: number[] } | null = null;

    for (const line of lines) {
      if (line.includes(':')) {
        const [area, ...descParts] = line.split(':');
        const desc = descParts.join(':').trim();
        const allLevelMatches = Array.from(desc.matchAll(/\((\d)\)/g));
        const levels = allLevelMatches.map(m => parseInt(m[1]));
        
        currentArea = {
          area: area.trim(),
          description: desc,
          levels: levels
        };
        results.push(currentArea);
      } else if (currentArea && line.trim()) {
        const cleanLine = line.trim();
        currentArea.description += ' ' + cleanLine;
        const allLevelMatches = Array.from(cleanLine.matchAll(/\((\d)\)/g));
        const levels = allLevelMatches.map(m => parseInt(m[1]));
        currentArea.levels.push(...levels);
      }
    }

    return results
      .map(item => ({
        ...item,
        // Sort levels descending so the highest risk is most prominent
        levels: item.levels.length > 0 ? [...new Set(item.levels)].sort((a,b) => b-a) : [0]
      }))
      .filter(item => item.area);
  };

  const parsedDangerLevels = typeof nivologica === 'string' ? parseDangerLevels(nivologica) : null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="px-3">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={12} className="text-blue-500/50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Altas Cumbres / Seguridad en Montaña</span>
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-white">{activeName}</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">Sincronización AEMET en tiempo real</p>
        </div>
      </div>

      {/* Danger Levels (Highlighted Section) */}
      {parsedDangerLevels && parsedDangerLevels.length > 0 && (
        <div className="bg-orange-600/10 border border-orange-500/20 p-6 rounded-[2.5rem] shadow-2xl space-y-4">
          <div className="flex items-center gap-3 px-2">
             <div className="bg-orange-500/20 p-2.5 rounded-xl shadow-inner"><ShieldAlert className="text-orange-400" size={18}/></div>
             <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-orange-100 italic">Estimación de Riesgo</h4>
                <p className="text-[10px] text-orange-400/70 font-bold uppercase tracking-widest">Niveles por Macizo</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parsedDangerLevels.map((item, idx) => (
              <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-orange-500/10 flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white uppercase truncate">{item.area}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-2 md:line-clamp-none whitespace-normal">{item.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {item.levels.map((lvl, lIdx) => (
                    <div key={lIdx} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-lg ${
                      lvl >= 4 ? 'bg-red-600 text-white' : 
                      lvl >= 3 ? 'bg-orange-600 text-white' : 
                      lvl >= 2 ? 'bg-yellow-500 text-slate-900' : 
                      'bg-green-500 text-white'
                    }`}>
                      {lvl || '?'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Nivológica Details */}
      {typeof nivologica === 'string' ? (
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="bg-red-500/20 p-2.5 rounded-xl shadow-inner"><ShieldAlert className="text-red-400" size={18}/></div>
             <h4 className="font-black text-xs uppercase tracking-widest text-red-100 italic">Boletín Oficial Completo</h4>
          </div>
          <div className="text-slate-300 text-[14px] leading-relaxed font-medium border-l-2 border-red-900/50 pl-6 whitespace-pre-wrap overflow-x-hidden">
            {nivologica}
          </div>
        </div>
      ) : (
        nivoSections.map((section, sIdx) => (
          <div key={`nivo-${sIdx}`} className="bg-slate-900 border border-red-500/20 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
               <div className="bg-red-500/20 p-2.5 rounded-xl shadow-inner"><ShieldAlert className="text-red-400" size={18}/></div>
               <h4 className="font-black text-xs uppercase tracking-widest text-red-100">
                 {section.nombre.replace(/_/g, ' ')}
               </h4>
            </div>
            <div className="space-y-4">
              {section.parrafo.map((p, pIdx) => (
                p.texto.trim() && (
                  <p key={pIdx} className="text-slate-300 text-[15px] leading-relaxed font-medium border-l-2 border-red-900/50 pl-6 italic">
                    {p.texto}
                  </p>
                )
              ))}
            </div>
          </div>
        ))
      )}

      {/* Main Weather Analysis or Sections */}
      {sections.length > 0 ? (
        sections.map((section, sIdx) => (
          <div key={`weather-${sIdx}`} className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-2.5 rounded-xl shadow-inner">
                 <History className="text-blue-400" size={18}/>
               </div>
               <h4 className="font-black text-xs uppercase tracking-widest text-slate-100">
                 {section.nombre.replace(/_/g, ' ')}
               </h4>
            </div>
            <div className="space-y-4">
              {section.parrafo.map((p, pIdx) => (
                p.texto.trim() && (
                  <p key={pIdx} className="text-slate-300 text-[15px] leading-relaxed font-medium border-l-2 border-slate-800 pl-6 italic">
                    {p.texto}
                  </p>
                )
              ))}
            </div>
          </div>
        ))
      ) : (
        predictionText && (
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-2.5 rounded-xl shadow-inner"><Info className="text-blue-400" size={18}/></div>
               <h4 className="font-black text-xs uppercase tracking-widest text-slate-100">Análisis Meteorológico</h4>
            </div>
            <div className="text-slate-300 text-[15px] leading-relaxed whitespace-pre-wrap font-medium border-l-2 border-slate-800 pl-6 italic">
              {predictionText}
            </div>
          </div>
        )
      )}

      {!sections.length && !nivoSections.length && !predictionText && (
        <div className="bg-slate-900/40 border border-dashed border-white/10 p-12 rounded-[2.5rem] text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sincronizando última actualización de montaña...</p>
        </div>
      )}
    </div>
  );
};
