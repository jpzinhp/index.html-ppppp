import 'dotenv/config';

function truthy(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  ai: {
    apiKey: process.env.AI_API_KEY || '',
    apiUrl: process.env.AI_API_URL || 'https://api.anthropic.com/v1/messages',
    model: process.env.AI_MODEL || 'claude-sonnet-5',
    get enabled() {
      return truthy(config.ai.apiKey);
    }
  },

  images: {
    pexelsKey: process.env.PEXELS_API_KEY || '',
    get enabled() {
      return truthy(config.images.pexelsKey);
    }
  }
};
