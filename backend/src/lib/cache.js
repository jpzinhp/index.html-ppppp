// Cache simples em memória com TTL, para não bater repetidamente nas APIs
// públicas (Nominatim/Overpass/Pexels) com a mesma consulta.
const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs = 5 * 60 * 1000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function withCache(key, ttlMs, fn) {
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  const value = await fn();
  cacheSet(key, value, ttlMs);
  return value;
}
