import type { Business, GeneratorPreferences, ImagesResult, SearchResponse, SiteContent, SiteStyle } from '../types';

// Em desenvolvimento, o Vite faz proxy de /api para o backend (ver
// vite.config.ts). Em produção, defina VITE_API_BASE_URL apontando para a
// URL pública do backend. O frontend NUNCA guarda nenhuma chave secreta —
// toda integração externa (Nominatim/Overpass/Pexels/IA) roda no backend.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api';

class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
  } catch (e) {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique se o backend está no ar.');
  }

  let data: any = null;
  try {
    data = await resp.json();
  } catch {
    // resposta sem corpo JSON
  }

  if (!resp.ok) {
    throw new ApiError(data?.error || `Erro ${resp.status} ao chamar ${path}`);
  }
  return data as T;
}

export interface HealthResponse {
  status: string;
  mode: { ai: 'ai' | 'demo'; images: 'pexels' | 'placeholder' };
}

export function getHealth() {
  return request<HealthResponse>('/health');
}

export interface SearchParams {
  city: string;
  state?: string;
  category: string;
  keyword?: string;
  demo?: boolean;
}

export function searchBusinesses(params: SearchParams) {
  const qs = new URLSearchParams();
  qs.set('city', params.city);
  if (params.state) qs.set('state', params.state);
  qs.set('category', params.category);
  if (params.keyword) qs.set('keyword', params.keyword);
  if (params.demo) qs.set('demo', 'true');
  return request<SearchResponse>(`/search?${qs.toString()}`);
}

export function generateSiteContent(business: Business, preferences: Partial<GeneratorPreferences> & { categoryValue?: string }) {
  return request<{ content: SiteContent; mode: 'ai' | 'demo' }>('/generate-site', {
    method: 'POST',
    body: JSON.stringify({ business, preferences })
  });
}

export function searchImages(query: string, count = 5) {
  return request<ImagesResult>('/search-images', {
    method: 'POST',
    body: JSON.stringify({ query, count })
  });
}

export function generateHtml(payload: {
  business: Business;
  content: SiteContent;
  images: ImagesResult;
  style: SiteStyle;
  color: string;
}) {
  return request<{ html: string }>('/generate-html', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
