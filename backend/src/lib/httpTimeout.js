// fetch com timeout + retry simples, usado por todas as integrações
// externas (Nominatim, Overpass, Pexels, IA).
export async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchWithRetry(url, options = {}, { timeoutMs = 10000, retries = 1, retryDelayMs = 400 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetchWithTimeout(url, options, timeoutMs);
      if (resp.ok) return resp;
      lastErr = new Error(`HTTP ${resp.status} em ${url}`);
    } catch (e) {
      lastErr = e;
    }
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
  throw lastErr;
}
