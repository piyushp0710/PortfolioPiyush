// Server-side configuration. Read lazily so tests and the local dev entry can
// populate process.env first. Nothing here is ever sent to the browser.

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'];

function intFromEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getConfig() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const extraOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  return {
    isProduction,
    geminiApiKey: process.env.GEMINI_API_KEY?.trim() || '',
    model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
    // MINIMAL keeps latency/cost low; set to "" to omit for models without thinking levels.
    thinkingLevel: process.env.GEMINI_THINKING_LEVEL ?? 'MINIMAL',
    maxOutputTokens: intFromEnv('CHAT_MAX_OUTPUT_TOKENS', 800),
    timeoutMs: intFromEnv('CHAT_TIMEOUT_MS', 20000),
    rateLimitPerMinute: intFromEnv('CHAT_RATE_LIMIT_PER_MINUTE', 8),
    rateLimitPerHour: intFromEnv('CHAT_RATE_LIMIT_PER_HOUR', 60),
    allowedOrigins: isProduction ? extraOrigins : [...DEV_ORIGINS, ...extraOrigins],
  };
}

// Limits on visitor input, enforced in middleware/validateChat.js.
export const LIMITS = Object.freeze({
  messageMaxChars: 1000,
  historyMaxTurns: 10,
  historyAcceptMaxTurns: 50,
  historyItemMaxChars: 2000,
  historyTotalMaxChars: 8000,
  bodyMaxBytes: '16kb',
});
