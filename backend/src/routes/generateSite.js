import { Router } from 'express';
import { gerarConteudoDoSite } from '../lib/aiGenerator.js';

const router = Router();

router.post('/', async (req, res) => {
  const { business, preferences } = req.body || {};
  if (!business || !business.name) {
    return res.status(400).json({ error: 'Dados da empresa (business.name) são obrigatórios.' });
  }

  try {
    const { content, mode } = await gerarConteudoDoSite(business, preferences || {});
    res.json({ content, mode });
  } catch (e) {
    // Mesmo um erro inesperado aqui não deve derrubar a experiência do
    // usuário — mas se acontecer, respondemos com uma mensagem clara.
    console.error('[generate-site] erro inesperado:', e);
    res.status(500).json({ error: 'Não foi possível gerar o conteúdo do site agora. Tente novamente.' });
  }
});

export default router;
