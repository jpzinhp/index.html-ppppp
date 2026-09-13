import { Router } from 'express';
import { buildSiteHtml } from '../lib/htmlBuilder.js';

const router = Router();

router.post('/', (req, res) => {
  const { business, content, images, style, color } = req.body || {};
  if (!business || !business.name) {
    return res.status(400).json({ error: 'Dados da empresa (business.name) são obrigatórios.' });
  }
  if (!content || !content.headline) {
    return res.status(400).json({ error: 'Conteúdo do site ausente — gere o conteúdo antes (POST /api/generate-site).' });
  }

  try {
    const safeImages = images && Array.isArray(images.photos) && images.photos.length
      ? images
      : { photos: [], isPlaceholder: true };
    const html = buildSiteHtml({ business, content, images: safeImages, style, color });
    res.json({ html });
  } catch (e) {
    console.error('[generate-html] erro inesperado:', e);
    res.status(500).json({ error: 'Não foi possível montar o HTML do site agora.' });
  }
});

export default router;
