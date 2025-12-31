import { useQuery } from '@tanstack/react-query';
import { getAemetData } from '../api/weatherService';
import type { WeatherData, TabType } from '../types';

export interface WeatherQueryResponse {
  weather: WeatherData | null;
  nivologica: any | null;
}

export const useWeather = (selectedId: string, activeTab: TabType) => {
  const { data, isLoading, error, refetch } = useQuery<WeatherQueryResponse>({
    queryKey: ['weather', activeTab, selectedId],
    queryFn: async () => {
      if (activeTab === 'localidad') {
        const endpoint = `prediccion/especifica/municipio/horaria/${selectedId}`;
        const response = await getAemetData<WeatherData[]>(endpoint);
        
        return {
          weather: response[0] || null,
          nivologica: null
        };
      } else {
        // For simple mountain zones, we only fetch nivological data as requested
        const nivoEndpoint = `prediccion/especifica/nivologica/${selectedId}`;
        const nivoRes = await getAemetData<any>(nivoEndpoint);

        return {
          weather: null,
          nivologica: Array.isArray(nivoRes) ? nivoRes[0] : nivoRes
        };
      }
    },
    enabled: !!selectedId && !!activeTab
  });

  return { 
    loading: isLoading, 
    error: error ? (error as any).message || "Error al conectar con AEMET" : null, 
    data, 
    refetch 
  };
};

export const useMunicipios = () => {
  return useQuery({
    queryKey: ['municipios'],
    queryFn: async () => {
      const endpoint = 'maestro/municipios';
      const response = await getAemetData<any[]>(endpoint);
      
      // AEMET returns IDs like "id22170", we need just "22170" for the forecast URL
      return response.map(m => ({
        id: m.id.replace('id', ''),
        name: m.nombre,
        type: 'municipio' as const
      })).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24,    // 24 hours
  });
};
