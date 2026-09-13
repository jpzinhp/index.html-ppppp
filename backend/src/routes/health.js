import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    mode: {
      ai: config.ai.enabled ? 'ai' : 'demo',
      images: config.images.enabled ? 'pexels' : 'placeholder'
    }
  });
});

export default router;
