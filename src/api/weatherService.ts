import { API_KEY } from '../config/aemet';
import { fetchWithRetry } from './httpClient';

// Use absolute URL in production (not localhost), relative proxy in development
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BASE_URL = isLocal ? "/opendata/api" : "https://opendata.aemet.es/opendata/api";

interface AemetResponse {
  descripcion: string;
  estado: number;
  datos: string;
  metadatos: string;
}

export const getAemetData = async <T>(endpoint: string): Promise<T> => {
  const url = `${BASE_URL}/${endpoint}`;
  
  const options = {
    method: 'GET',
    headers: {
      'api_key': API_KEY,
      'Accept': 'application/json'
    }
  };

  // Step 1: Get the temporary link
  const result = await fetchWithRetry<AemetResponse>(url, options);
  
  if (result.estado !== 200) {
    throw new Error(result.descripcion || "Respuesta inválida de AEMET");
  }
  
  // Step 2: Download final JSON from the provided URL
  // Hit direct URL in production, proxy only in dev
  const finalUrl = !isLocal ? result.datos : result.datos.replace("https://opendata.aemet.es", "");
  return await fetchWithRetry<T>(finalUrl);
};
