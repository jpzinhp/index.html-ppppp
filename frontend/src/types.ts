export interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  state?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  openingHours?: string | null;
  lat?: number | null;
  lon?: number | null;
  hasWebsite: boolean;
  source: 'osm' | 'demo';
}

export interface SearchResponse {
  results: Business[];
  total: number;
  demo: boolean;
  reason?: string;
  geocodedAs?: string;
  error?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export type SiteStyle = 'moderno' | 'premium' | 'minimalista' | 'corporativo' | 'elegante' | 'dark' | 'vibrante';

export interface GeneratorPreferences {
  segment: string;
  differentiators: string;
  services: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
  style: SiteStyle;
  color: string;
}

export interface SiteContent {
  headline: string;
  subheadline: string;
  about: string;
  services: string[];
  benefits: string[];
  cta: string;
  faq: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
}

export interface ImagesResult {
  photos: string[];
  isPlaceholder: boolean;
  source: 'pexels' | 'placeholder';
}

export interface GeneratedSite {
  id: string;
  business: Business;
  preferences: GeneratorPreferences;
  content: SiteContent;
  images: ImagesResult;
  html: string;
  mode: 'ai' | 'demo';
  createdAt: string;
  updatedAt: string;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
