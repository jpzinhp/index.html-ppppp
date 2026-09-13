import { Router } from 'express';
import { buscarNegociosReais } from '../lib/overpass.js';
import { gerarNegociosDemo } from '../lib/demoData.js';
import { getCategory, CATEGORIES } from '../lib/categories.js';

const router = Router();

router.get('/categories', (req, res) => {
  res.json({ categories: CATEGORIES.map(({ value, label }) => ({ value, label })) });
});

router.get('/', async (req, res) => {
  const { city, state, category, keyword, demo } = req.query;

  if (!city || !String(city).trim()) {
    return res.status(400).json({ error: 'Informe uma cidade para buscar.' });
  }
  if (!category) {
    return res.status(400).json({ error: 'Informe uma categoria (ou "outros" com palavra-chave).' });
  }
  const cat = getCategory(String(category));
  if (cat.value === 'outros' && (!keyword || !String(keyword).trim())) {
    return res.status(400).json({ error: 'Para a categoria "Outros", informe uma palavra-chave.' });
  }

  // Modo demo explícito, pedido pelo cliente (ex.: sem internet ainda).
  if (demo === 'true') {
    const negocios = gerarNegociosDemo({ city, state, category });
    return res.json({ results: negocios, total: negocios.length, demo: true, reason: 'Solicitado pelo cliente.' });
  }

  try {
    const { negocios, geocodedAs } = await buscarNegociosReais({
      city: String(city).trim(),
      state: state ? String(state).trim() : undefined,
      category: String(category),
      keyword: keyword ? String(keyword).trim() : undefined
    });
    return res.json({ results: negocios, total: negocios.length, demo: false, geocodedAs });
  } catch (e) {
    console.warn('[search] busca real falhou, retornando modo demo:', e.message);
    const negocios = gerarNegociosDemo({ city, state, category });
    return res.json({
      results: negocios,
      total: negocios.length,
      demo: true,
      reason: e.message
    });
  }
});

export default router;
