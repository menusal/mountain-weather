import { useState } from 'react';
import { Mountain } from 'lucide-react';
import { ZONES } from './config/aemet';
import type { TabType } from './types';
import { useWeather, useMunicipios } from './hooks/useWeather';

// Layout
import { Header } from './components/layout/Header';
import { LocationMenu } from './components/layout/LocationMenu';
import { NavigationTabs } from './components/layout/NavigationTabs';

// UI
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { WeatherSkeleton } from './components/ui/WeatherSkeleton';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Views
import { WeatherDailyView } from './components/weather/WeatherDailyView';
import { WeatherMountainView } from './components/weather/WeatherMountainView';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60,    // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState<TabType>('localidad');
  // Default to Panticosa (22170)
  const [selectedId, setSelectedId] = useState<string>('22170');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook handles data fetching
  const { data: municipios } = useMunicipios();
  const { loading, error, data, refetch } = useWeather(selectedId, activeTab);

  const handleSelection = (id: string, type: 'municipio' | 'montana') => {
    setActiveTab(type === 'municipio' ? 'localidad' : 'zona');
    setSelectedId(id);
    setIsMenuOpen(false);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'localidad') {
      setSelectedId('22170');
    } else {
      setSelectedId(ZONES[0].id);
    }
  };

  const getActiveName = () => {
    if (activeTab === 'zona') {
      return ZONES.find(x => x.id === selectedId)?.name || "";
    }
    return municipios?.find(m => m.id === selectedId)?.name || "Panticosa";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header 
        loading={loading} 
        isMenuOpen={isMenuOpen} 
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
      />

      <LocationMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        selectedId={selectedId}
        onSelect={handleSelection}
      />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {error ? (
          <ErrorDisplay message={error} onRetry={refetch} />
        ) : loading ? (
          <WeatherSkeleton />
        ) : data ? (
          activeTab === 'localidad' ? (
             data.weather ? (
               <WeatherDailyView data={data.weather} />
             ) : (
               <div className="text-center py-20 text-slate-500 text-xs">No hay datos disponibles para esta localidad</div>
             )
          ) : (
             <WeatherMountainView 
                weather={data.weather} 
                nivologica={data.nivologica} 
                activeName={getActiveName()} 
             />
          )
        ) : (
          <div className="text-center py-32 space-y-6">
            <div className="bg-slate-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl border border-white/5">
              <Mountain size={40} className="text-slate-700" />
            </div>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Inicia la expedición</p>
          </div>
        )}
      </main>

      <footer className="mt-16 px-8 py-14 border-t border-white/5 text-center bg-slate-950/50">
        <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.4em] leading-loose max-w-xs mx-auto">
          Agencia Estatal de Meteorología<br/>
          Datos de acceso público · Sistema El tiempo en la montaña
        </p>
      </footer>

      {/* Utilities for scrollbar hiding if needed globally or via class */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default App;
