import { config } from '../config.js';
import { fetchWithTimeout } from './httpTimeout.js';
import { gerarConteudoLocal } from './localTemplate.js';

const SCHEMA_HINT = `Responda APENAS em JSON válido, sem markdown, sem texto extra, exatamente neste formato:
{"headline":"...","subheadline":"...","about":"...","services":["...","...","..."],"benefits":["...","...","...","..."],"cta":"...","faq":[{"question":"...","answer":"..."},{"question":"...","answer":"..."}],"seoTitle":"...","seoDescription":"..."}`;

function buildPrompt(business, prefs) {
  return `Gere o conteúdo de um site institucional profissional para uma empresa real.
${SCHEMA_HINT}

Empresa: ${business.name}
Segmento: ${prefs.segment || business.category}
Cidade: ${business.city || 'não informado'}
Diferenciais informados: ${prefs.differentiators || 'nenhum'}
Serviços informados: ${prefs.services || 'nenhum'}

Regras: "headline" é uma frase de efeito curta (até 6 palavras), sem clichês genéricos.
"subheadline" uma frase curta de apoio (até 12 palavras). "about" 2-3 frases persuasivas.
"services" de 3 a 6 itens curtos. "benefits" exatamente 4 diferenciais curtos (2-3 palavras).
"cta" texto de botão (até 4 palavras). "faq" exatamente 3 perguntas e respostas curtas e realistas.
Português do Brasil, tom profissional e direto.`;
}

function extrairJson(texto) {
  const limpo = texto.replace(/```json|```/g, '').trim();
  return JSON.parse(limpo);
}

/**
 * Gera o conteúdo do site. Usa a IA real quando AI_API_KEY está
 * configurada no backend; caso contrário (ou se a chamada falhar por
 * qualquer motivo), usa o gerador local por templates — a geração NUNCA
 * quebra por falta ou falha de uma API de IA.
 */
export async function gerarConteudoDoSite(business, prefs = {}) {
  if (!config.ai.enabled) {
    return { content: gerarConteudoLocal(business, prefs), mode: 'demo' };
  }

  try {
    const resp = await fetchWithTimeout(
      config.ai.apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.ai.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.ai.model,
          max_tokens: 1200,
          messages: [{ role: 'user', content: buildPrompt(business, prefs) }]
        })
      },
      15000
    );
    if (!resp.ok) throw new Error(`IA respondeu status ${resp.status}`);
    const data = await resp.json();
    const texto = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    const content = extrairJson(texto);
    return { content, mode: 'ai' };
  } catch (e) {
    console.warn('[ai] geração via IA falhou, usando gerador local:', e.message);
    return { content: gerarConteudoLocal(business, prefs), mode: 'demo' };
  }
}
