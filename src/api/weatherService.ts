import { API_KEY } from '../config/aemet';
import { fetchWithRetry } from './httpClient';

const BASE_URL = "/opendata/api";

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
  // Always use the relative proxy to avoid CORS in both dev and prod
  const finalUrl = result.datos.replace("https://opendata.aemet.es", "");
  return await fetchWithRetry<T>(finalUrl);
};
