import express from 'express';
import cors from 'cors';
import { config } from './config.js';

import healthRoutes from './routes/health.js';
import searchRoutes from './routes/search.js';
import generateSiteRoutes from './routes/generateSite.js';
import searchImagesRoutes from './routes/searchImages.js';
import generateHtmlRoutes from './routes/generateHtml.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigins.length ? config.corsOrigins : '*'
  })
);
app.use(express.json({ limit: '2mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/generate-site', generateSiteRoutes);
app.use('/api/search-images', searchImagesRoutes);
app.use('/api/generate-html', generateHtmlRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[erro não tratado]', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

app.listen(config.port, () => {
  console.log(`AI Website Hunter API rodando em http://localhost:${config.port}`);
  console.log(`Modo IA: ${config.ai.enabled ? 'ativado' : 'demo (local)'}`);
  console.log(`Modo imagens: ${config.images.enabled ? 'Pexels' : 'placeholder local'}`);
});
