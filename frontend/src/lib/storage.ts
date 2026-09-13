// Persistência local (localStorage) — não exige backend/banco pago.
// Todo acesso é protegido: o app nunca deve quebrar por causa disso
// (modo privado do navegador, quota cheia, etc.).
const PREFIX = 'ai-website-hunter:';

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage indisponível (modo privado, quota cheia...) — ignora.
  }
}
