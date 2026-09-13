import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Business, GeneratedSite } from '../types';
import { loadJson, saveJson } from '../lib/storage';

interface SearchInfo {
  demo: boolean;
  reason?: string;
  total: number;
  geocodedAs?: string;
  city: string;
  state?: string;
  category: string;
  keyword?: string;
}

interface AppDataState {
  businesses: Business[];
  searchInfo: SearchInfo | null;
  favorites: Business[];
  savedSites: GeneratedSite[];
  sitesGeneratedCount: number;

  stats: {
    found: number;
    withoutWebsite: number;
    generated: number;
    saved: number;
  };

  setSearchResults: (results: Business[], meta: SearchInfo) => void;
  toggleFavorite: (business: Business) => void;
  isFavorite: (id: string) => boolean;
  saveSite: (site: GeneratedSite) => void;
  updateSavedSite: (id: string, patch: Partial<GeneratedSite>) => void;
  removeSavedSite: (id: string) => void;
  registerSiteGenerated: () => void;
}

const AppDataContext = createContext<AppDataState | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [favorites, setFavorites] = useState<Business[]>(() => loadJson('favorites', []));
  const [savedSites, setSavedSites] = useState<GeneratedSite[]>(() => loadJson('savedSites', []));
  const [sitesGeneratedCount, setSitesGeneratedCount] = useState<number>(() => loadJson('sitesGeneratedCount', 0));
  const [seenBusinesses, setSeenBusinesses] = useState<Record<string, Business>>(() => loadJson('seenBusinesses', {}));

  const setSearchResults = useCallback((results: Business[], meta: SearchInfo) => {
    setBusinesses(results);
    setSearchInfo(meta);
    setSeenBusinesses((prev) => {
      const next = { ...prev };
      for (const b of results) next[b.id] = b;
      saveJson('seenBusinesses', next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  const toggleFavorite = useCallback((business: Business) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === business.id);
      const next = exists ? prev.filter((f) => f.id !== business.id) : [...prev, business];
      saveJson('favorites', next);
      return next;
    });
  }, []);

  const saveSite = useCallback((site: GeneratedSite) => {
    setSavedSites((prev) => {
      const next = [site, ...prev.filter((s) => s.id !== site.id)];
      saveJson('savedSites', next);
      return next;
    });
  }, []);

  const updateSavedSite = useCallback((id: string, patch: Partial<GeneratedSite>) => {
    setSavedSites((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s));
      saveJson('savedSites', next);
      return next;
    });
  }, []);

  const removeSavedSite = useCallback((id: string) => {
    setSavedSites((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveJson('savedSites', next);
      return next;
    });
  }, []);

  const registerSiteGenerated = useCallback(() => {
    setSitesGeneratedCount((prev) => {
      const next = prev + 1;
      saveJson('sitesGeneratedCount', next);
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    const all = Object.values(seenBusinesses);
    return {
      found: all.length,
      withoutWebsite: all.filter((b) => !b.hasWebsite).length,
      generated: sitesGeneratedCount,
      saved: savedSites.length
    };
  }, [seenBusinesses, sitesGeneratedCount, savedSites]);

  const value: AppDataState = {
    businesses,
    searchInfo,
    favorites,
    savedSites,
    sitesGeneratedCount,
    stats,
    setSearchResults,
    toggleFavorite,
    isFavorite,
    saveSite,
    updateSavedSite,
    removeSavedSite,
    registerSiteGenerated
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de <AppDataProvider>');
  return ctx;
}
