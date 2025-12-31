export const fetchWithRetry = async <T>(url: string, options: RequestInit = {}, retries = 5, backoff = 1000): Promise<T> => {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) throw new Error("Límite de peticiones de AEMET alcanzado (429)");
    if (!response.ok) throw new Error(`Error en servidor AEMET: ${response.status}`);
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    // For text responses, AEMET often uses ISO-8859-1 or has misconfigured headers.
    // We'll read the raw bytes and decode them.
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    
    // Simple heuristic: if we see the '' character (replacement character), 
    // it likely means UTF-8 decoding failed, so we try ISO-8859-1.
    let finalContent: any = text;
    if (text.includes('')) {
      finalContent = new TextDecoder('iso-8859-1').decode(buffer);
    }
    
    // Try to parse as JSON if it looks like a JSON structure
    if (typeof finalContent === 'string' && (finalContent.trim().startsWith('[') || finalContent.trim().startsWith('{'))) {
      try {
        return JSON.parse(finalContent);
      } catch (e) {
        // Not valid JSON, return as text
      }
    }
    
    return finalContent as unknown as T;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry<T>(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};
