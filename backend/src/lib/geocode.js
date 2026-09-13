import { fetchWithRetry } from './httpTimeout.js';
import { withCache } from './cache.js';

const BRASIL_VIEWBOX = '-74.0,6.0,-32.0,-34.0'; // left,top,right,bottom

/**
 * Geocodifica uma cidade/bairro/endereço, restrito ao Brasil, usando o
 * Nominatim (OpenStreetMap) — gratuito e sem necessidade de chave.
 * Lança erro se não encontrar nada.
 */
export async function geocodeLocation({ city, state, keyword }) {
  const query = [city, state, 'Brasil'].filter(Boolean).join(', ');
  const cacheKey = `geocode:${query.toLowerCase()}`;

  return withCache(cacheKey, 30 * 60 * 1000, async () => {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('countrycodes', 'br');
    url.searchParams.set('accept-language', 'pt-BR');
    url.searchParams.set('limit', '1');
    url.searchParams.set('viewbox', BRASIL_VIEWBOX);
    url.searchParams.set('bounded', '1');
    url.searchParams.set('q', query);

    const resp = await fetchWithRetry(
      url.toString(),
      { headers: { 'User-Agent': 'AIWebsiteHunter/1.0 (uso educacional/demo)' } },
      { timeoutMs: 9000, retries: 1 }
    );
    const data = await resp.json();
    const hit = data && data[0];
    if (!hit) {
      throw new Error(`Não foi possível localizar "${query}" no Brasil. Confira a grafia da cidade/estado.`);
    }
    return {
      lat: parseFloat(hit.lat),
      lon: parseFloat(hit.lon),
      displayName: hit.display_name
    };
  });
}
