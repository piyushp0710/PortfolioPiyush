import { rateLimit } from 'express-rate-limit';
import { Errors, sendError } from '../errors.js';

/**
 * Origin allowlist with CORS headers. Same-origin requests (the deployed site
 * calling its own /api) are always allowed; other browser origins must be in
 * config.allowedOrigins. Requests without an Origin header (curl, server-to-
 * server) pass through — rate limiting is the control for those.
 */
export function originGuard(config) {
  return (req, res, next) => {
    const origin = req.get('origin');
    if (!origin) return next();

    const host = req.get('x-forwarded-host') ?? req.get('host');
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === host;
    } catch {
      // malformed Origin header -> treated as foreign
    }

    if (!sameOrigin && !config.allowedOrigins.includes(origin)) {
      return sendError(res, Errors.forbiddenOrigin());
    }

    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '600');
      return res.sendStatus(204);
    }
    next();
  };
}

/**
 * Per-IP limits for the chat endpoint. The store is in-memory, so on
 * serverless it is per warm instance; pair with a Vercel Firewall rule for a hard cap.
 */
export function chatRateLimiters(config) {
  const handler = (_req, res) => sendError(res, Errors.rateLimited());
  const common = { standardHeaders: 'draft-8', legacyHeaders: false, handler };
  return [
    rateLimit({ ...common, windowMs: 60 * 1000, limit: config.rateLimitPerMinute }),
    rateLimit({ ...common, windowMs: 60 * 60 * 1000, limit: config.rateLimitPerHour }),
  ];
}

export function securityHeaders(_req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Cache-Control', 'no-store');
  next();
}
