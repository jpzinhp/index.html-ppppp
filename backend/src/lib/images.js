import { config } from '../config.js';
import { fetchWithTimeout } from './httpTimeout.js';
import { withCache } from './cache.js';

function placeholderSvgDataUri(seed, w = 800, h = 600) {
  const hue = Math.abs(hashCode(seed)) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="hsl(${hue},35%,88%)"/>
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.22}" fill="hsl(${hue},40%,70%)"/>
    <text x="50%" y="82%" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.06)}" fill="hsl(${hue},25%,35%)" text-anchor="middle">Imagem ilustrativa</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function placeholders(query, quantidade) {
  return Array.from({ length: quantidade }, (_, i) => placeholderSvgDataUri(`${query}-${i}`));
}

/**
 * Busca fotos ilustrativas do segmento do negócio (nunca fotos reais da
 * empresa específica — nenhuma fonte gratuita fornece isso). Usa Pexels
 * quando PEXELS_API_KEY está configurada; caso contrário, ou se a chamada
 * falhar, retorna placeholders locais em SVG — a geração nunca quebra.
 */
export async function buscarImagensIlustrativas(query, quantidade = 5) {
  if (!config.images.enabled) {
    return { photos: placeholders(query, quantidade), isPlaceholder: true, source: 'placeholder' };
  }

  const cacheKey = `pexels:${query}:${quantidade}`;
  try {
    return await withCache(cacheKey, 60 * 60 * 1000, async () => {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${quantidade}`;
      const resp = await fetchWithTimeout(url, { headers: { Authorization: config.images.pexelsKey } }, 10000);
      if (!resp.ok) throw new Error(`Pexels respondeu status ${resp.status}`);
      const data = await resp.json();
      const urls = (data.photos || []).map((p) => p.src?.large2x || p.src?.large).filter(Boolean);
      if (urls.length === 0) throw new Error('Pexels não retornou fotos para esse termo');
      while (urls.length < quantidade) urls.push(urls[urls.length % urls.length]);
      return { photos: urls.slice(0, quantidade), isPlaceholder: false, source: 'pexels' };
    });
  } catch (e) {
    console.warn('[images] Pexels falhou, usando placeholder:', e.message);
    return { photos: placeholders(query, quantidade), isPlaceholder: true, source: 'placeholder' };
  }
}
