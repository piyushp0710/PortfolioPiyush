import express from 'express';
import { getConfig, LIMITS } from './config.js';
import { AppError, Errors, sendError } from './errors.js';
import { originGuard, chatRateLimiters, securityHeaders } from './middleware/security.js';
import { validateChat } from './middleware/validateChat.js';
import { createAiService } from './services/aiService.js';

/**
 * Build the Express app. Used by Vercel (api/index.js), local dev
 * (server/index.js) and tests, which inject a fake aiService.
 */
export function createApp({ config = getConfig(), aiService = createAiService(config) } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Vercel / local proxy sit in front: trust one hop so req.ip is the visitor.
  app.set('trust proxy', 1);

  const api = express.Router();
  api.use(securityHeaders);
  api.use(originGuard(config));

  api.get('/health', (_req, res) => {
    res.json({ status: 'ok', aiConfigured: aiService.isConfigured() });
  });

  api.post(
    '/chat',
    ...chatRateLimiters(config),
    express.json({ limit: LIMITS.bodyMaxBytes, strict: true }),
    validateChat,
    async (req, res, next) => {
      try {
        const reply = await aiService.reply(req.chat);
        res.json({ reply });
      } catch (err) {
        next(err);
      }
    },
  );

  api.use((_req, _res, next) => next(Errors.notFound()));

  app.use('/api', api);

  // eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
  app.use((err, _req, res, _next) => {
    if (err instanceof AppError) return sendError(res, err);
    if (err?.type === 'entity.too.large') return sendError(res, Errors.invalidRequest('Request body is too large.'));
    if (err?.type === 'entity.parse.failed') return sendError(res, Errors.invalidRequest('Request body must be valid JSON.'));
    console.error('[chat] unhandled_error', { name: err?.name });
    sendError(res, Errors.internal());
  });

  return app;
}

export default createApp;
