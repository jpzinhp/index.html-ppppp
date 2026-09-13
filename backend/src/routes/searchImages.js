import { Router } from 'express';
import { buscarImagensIlustrativas } from '../lib/images.js';

const router = Router();

router.post('/', async (req, res) => {
  const { query, count } = req.body || {};
  if (!query || !String(query).trim()) {
    return res.status(400).json({ error: 'Informe "query" (ex.: o segmento do negócio) para buscar imagens.' });
  }
  const quantidade = Math.min(Math.max(Number(count) || 5, 1), 10);

  try {
    const result = await buscarImagensIlustrativas(String(query).trim(), quantidade);
    res.json(result);
  } catch (e) {
    console.error('[search-images] erro inesperado:', e);
    res.status(500).json({ error: 'Não foi possível buscar imagens agora.' });
  }
});

export default router;
