import { fetchWithTimeout } from './httpTimeout.js';
import { geocodeLocation } from './geocode.js';
import { getCategory } from './categories.js';

// Vários espelhos, de infraestruturas diferentes, para não depender de um
// único provedor caso ele esteja fora do ar ou lento.
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.osm.ch/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
];

const RAIO_BUSCA_METROS = 12000;

function tagClause(tag, tipoElemento, lat, lon, raio) {
  const around = `(around:${raio},${lat},${lon})`;
  if (tag.includes('=')) {
    const [k, v] = tag.split('=');
    return `${tipoElemento}["${k}"="${v}"]${around};`;
  }
  // Sem "=": qualquer valor para essa chave (ex.: "shop" → qualquer loja).
  return `${tipoElemento}["${tag}"]${around};`;
}

function keywordClause(keyword, tipoElemento, lat, lon, raio) {
  const around = `(around:${raio},${lat},${lon})`;
  const safe = String(keyword).replace(/["\\]/g, '');
  return `${tipoElemento}["name"~"${safe}",i]${around};`;
}

async function consultarOverpass(query, timeoutMs, mirrors = OVERPASS_MIRRORS) {
  const erros = [];
  for (const mirror of mirrors) {
    try {
      const resp = await fetchWithTimeout(
        mirror + '?data=' + encodeURIComponent(query),
        {},
        timeoutMs
      );
      if (resp.ok) {
        const data = await resp.json();
        return data.elements || [];
      }
      erros.push(`${mirror} → status ${resp.status}`);
    } catch (e) {
      erros.push(`${mirror} → ${e.message}`);
    }
  }
  throw new Error('Todos os servidores do OpenStreetMap falharam: ' + erros.join(' | '));
}

function temSiteCadastrado(tags) {
  return !!(tags.website || tags['contact:website'] || tags.url || tags['website:menu']);
}

function extrairNegocios(elementos, { cidade, estado, categoriaLabel }) {
  const vistos = new Set();
  const resultados = [];
  for (const el of elementos) {
    const tags = el.tags;
    if (!tags || !tags.name) continue;
    const chave = (tags.name + '|' + (tags['addr:street'] || '')).toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);

    const lat = el.lat ?? el.center?.lat ?? null;
    const lon = el.lon ?? el.center?.lon ?? null;
    const website = tags.website || tags['contact:website'] || tags.url || null;

    resultados.push({
      id: `osm-${el.type}-${el.id}`,
      name: tags.name,
      category: categoriaLabel,
      city: cidade,
      state: estado || null,
      address:
        [tags['addr:street'], tags['addr:housenumber'], tags['addr:suburb']].filter(Boolean).join(', ') || null,
      phone: tags.phone || tags['contact:phone'] || null,
      website,
      instagram: tags['contact:instagram'] || null,
      facebook: tags['contact:facebook'] || null,
      openingHours: tags.opening_hours || null,
      lat,
      lon,
      hasWebsite: temSiteCadastrado(tags),
      source: 'osm'
    });
  }
  return resultados;
}

/**
 * Busca negócios reais no OpenStreetMap para uma cidade/categoria.
 * Estratégia em duas fases: node (rápido/leve) sempre; way+relation em
 * modo best-effort (mais lento), sem nunca travar a busca principal.
 */
export async function buscarNegociosReais({ city, state, category, keyword }) {
  const { lat, lon, displayName } = await geocodeLocation({ city, state, keyword });
  const cat = getCategory(category);
  const tags = cat.tags.length ? cat.tags : [];

  const construirFiltros = (tipos) => {
    const partes = [];
    for (const tipo of tipos) {
      if (tags.length) {
        for (const tag of tags) partes.push(tagClause(tag, tipo, lat, lon, RAIO_BUSCA_METROS));
      }
      if (keyword) partes.push(keywordClause(keyword, tipo, lat, lon, RAIO_BUSCA_METROS));
    }
    return partes.join('');
  };

  if (!tags.length && !keyword) {
    throw new Error('Informe uma categoria válida ou uma palavra-chave para buscar em "Outros".');
  }

  // Fase 1 — node, rápida e confiável.
  const filtrosNode = construirFiltros(['node']);
  const elementosNode = await consultarOverpass(
    `[out:json][timeout:15];(${filtrosNode});out center 80;`,
    9000
  );

  // Fase 2 — way/relation, best-effort (mais lenta de calcular).
  let elementosWR = [];
  try {
    const filtrosWR = construirFiltros(['way', 'relation']);
    elementosWR = await consultarOverpass(
      `[out:json][timeout:20];(${filtrosWR});out center 80;`,
      12000,
      OVERPASS_MIRRORS.slice(0, 3)
    );
  } catch (e) {
    console.warn('[overpass] complemento way/relation indisponível:', e.message);
  }

  const negocios = extrairNegocios([...elementosNode, ...elementosWR], {
    cidade: city,
    estado: state,
    categoriaLabel: cat.label
  });

  return { negocios, geocodedAs: displayName };
}
