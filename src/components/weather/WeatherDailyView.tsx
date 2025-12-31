import React, { useMemo } from 'react';
import { Wind, Droplets, Umbrella, Sunrise, Sunset, Navigation, Clock } from 'lucide-react';
import { format, parseISO, isAfter, startOfHour } from 'date-fns';
import type { WeatherData } from '../../types';
import WeatherIcon from '../ui/WeatherIcon';

interface WeatherDailyViewProps {
  data: WeatherData;
}

export const WeatherDailyView: React.FC<WeatherDailyViewProps> = ({ data }) => {
  // 1. Flatten all hourly data across all days
  const hourlyData = useMemo(() => {
    if (!data.prediccion?.dia) return [];

    const flattened: any[] = [];
    data.prediccion.dia.forEach(day => {
      const dateStr = day.fecha.split('T')[0];
      
      // We'll use temperature as the base iterator since it usually has all hours
      day.temperatura.forEach(t => {
        const hour = t.periodo;
        const fullDateTime = `${dateStr}T${hour.padStart(2, '0')}:00:00`;
        
        // Find corresponding data for this exact hour
        const sky = day.estadoCielo.find(s => s.periodo === hour);
        const precip = day.precipitacion.find(p => p.periodo === hour);
        const hum = day.humedadRelativa.find(h => h.periodo === hour);
        const sens = day.sensTermica.find(s => s.periodo === hour);
        
        // Wind is tricky, it has multiple entries per period (one for speed/dir, one for gust)
        const windEntries = day.vientoAndRachaMax.filter(v => v.periodo === hour);
        const wind = windEntries.find(v => v.velocidad);
        const gust = windEntries.find(v => v.value);

        flattened.push({
          dateTime: fullDateTime,
          hour: parseInt(hour),
          temp: t.value,
          sky: sky?.descripcion,
          icon: sky?.value,
          precip: precip?.value || '0',
          humidity: hum?.value,
          sens: sens?.value,
          windSpeed: wind?.velocidad?.[0],
          windDir: wind?.direccion?.[0],
          gust: gust?.value,
          // Daily data to carry over for current weather card
          orto: day.orto,
          ocaso: day.ocaso,
          probPrecip: day.probPrecipitacion[0]?.value || '0'
        });
      });
    });

    return flattened.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }, [data]);

  // 2. Identify the "Current" hour
  const currentEntry = useMemo(() => {
    if (hourlyData.length === 0) return null;
    
    const now = new Date();
    // In AEMET hourly, usually the best "current" is the one matching current hour or the next available
    const current = hourlyData.find(h => !isAfter(startOfHour(now), parseISO(h.dateTime))) 
                 || hourlyData[0];
    
    return current;
  }, [hourlyData]);

  // 3. Get next 12 hours starting from now
  const next12Hours = useMemo(() => {
    if (hourlyData.length === 0 || !currentEntry) return [];
    
    const currentIndex = hourlyData.findIndex(h => h.dateTime === currentEntry.dateTime);
    return hourlyData.slice(currentIndex, currentIndex + 12);
  }, [hourlyData, currentEntry]);

  if (!currentEntry) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Principal Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Navigation size={14} className="text-blue-200 fill-blue-200/20" />
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-100/50">{data.provincia}</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-1">{data.nombre}</h2>
              <p className="text-blue-100/70 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="opacity-50" />
                Ahora · {format(parseISO(currentEntry.dateTime), 'HH:mm')}
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <WeatherIcon condition={currentEntry.sky} icon={currentEntry.icon} size={48} />
            </div>
          </div>
          
          <div className="mt-12 flex items-baseline gap-2">
            <span className="text-8xl font-black tracking-tighter leading-none">
              {currentEntry.temp ?? '--'}°
            </span>
            <span className="text-2xl font-bold opacity-30">C</span>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center text-center">
              <Wind size={16} className="text-blue-300 mb-2" />
              <p className="text-[9px] uppercase font-black opacity-50 mb-1">Viento</p>
              <p className="text-lg font-bold">
                {currentEntry.windSpeed ?? '--'}
                <span className="text-[9px] font-normal opacity-60 ml-1">km/h</span>
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center text-center">
              <Droplets size={16} className="text-blue-300 mb-2" />
              <p className="text-[9px] uppercase font-black opacity-50 mb-1">Humedad</p>
              <p className="text-lg font-bold">{currentEntry.humidity ?? '--'}%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center text-center">
              <Umbrella size={16} className="text-blue-300 mb-2" />
              <p className="text-[9px] uppercase font-black opacity-50 mb-1">Prob. Ll.</p>
              <p className="text-lg font-bold">{currentEntry.probPrecip}%</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col items-center text-center">
              <div className="flex gap-2 mb-2">
                <Sunrise size={14} className="text-orange-300" />
                <Sunset size={14} className="text-indigo-300" />
              </div>
              <p className="text-[9px] uppercase font-black opacity-50 mb-1">Sol</p>
              <p className="text-[10px] font-bold">{currentEntry.orto} / {currentEntry.ocaso}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sensación Térmica</p>
            <p className="text-2xl font-black text-white">{currentEntry.sens ?? '--'}°</p>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-5 rounded-3xl space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Racha Máxima</p>
            <p className="text-2xl font-black text-white">
              {currentEntry.gust ?? '--'}
              <span className="text-xs font-bold text-slate-500 ml-1 italic">km/h</span>
            </p>
          </div>
      </div>

      <section>
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-3">Evolución próximas 12h</h3>
        <div className="flex gap-4 overflow-x-auto pb-6 px-2 no-scrollbar">
          {next12Hours.map((h, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-900/50 border border-white/5 p-5 rounded-3xl w-28 text-center space-y-4 shadow-xl hover:bg-slate-800/50 transition-colors">
              <span className="text-[10px] text-slate-500 font-black tracking-tighter">
                {format(parseISO(h.dateTime), 'HH:mm')}
              </span>
              <div className="flex justify-center py-1">
                <WeatherIcon condition={h.sky} icon={h.icon} size={28} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">{h.temp}°</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
