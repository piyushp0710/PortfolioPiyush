import { GoogleGenAI } from '@google/genai';
import { Errors, AppError } from '../errors.js';
import { buildContext, selectSections } from './contextSelector.js';
import { buildSystemPrompt, CONTEXT_OPEN, CONTEXT_CLOSE } from './systemPrompt.js';

const MAX_REPLY_CHARS = 4000;
const BLOCKED_FINISH_REASONS = new Set(['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII']);

const FALLBACK_REPLY =
  "Sorry, I can't help with that. I can answer questions about Piyush's skills, experience, projects and how to contact him.";

function log(event, details) {
  // Only codes/statuses: never message content, prompts or keys.
  console.error(`[chat] ${event}`, details);
}

/** Map provider/SDK failures to visitor-safe AppErrors. */
export function mapProviderError(err, { isProduction, model }) {
  if (err instanceof AppError) return err;
  if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
    log('provider_timeout', {});
    return Errors.timeout();
  }

  const status = Number(err?.status) || 0;
  const message = String(err?.message ?? '');
  if (status === 429) {
    log('provider_rate_limited_or_quota', { status });
    return Errors.busy();
  }
  if (status === 401 || status === 403 || (status === 400 && /api[_ ]?key/i.test(message))) {
    log('provider_auth_failed', { status, hint: 'check GEMINI_API_KEY' });
    return Errors.notConfigured(isProduction);
  }
  if (status === 404) {
    log('provider_model_unavailable', { status, model, hint: 'check GEMINI_MODEL' });
    return Errors.unavailable();
  }
  log('provider_error', { status, name: err?.name });
  return Errors.unavailable();
}

/** Server-side backstop: never return replies that leak internals. */
export function sanitizeReply(text, { apiKey }) {
  const reply = typeof text === 'string' ? text.trim() : '';
  if (!reply) return FALLBACK_REPLY;
  const lower = reply.toLowerCase();
  const leaked =
    (apiKey && reply.includes(apiKey)) ||
    lower.includes(CONTEXT_OPEN) ||
    lower.includes(CONTEXT_CLOSE) ||
    lower.includes('grounding rules') ||
    lower.includes('missingorunverified');
  if (leaked) {
    log('reply_blocked_leak', {});
    return FALLBACK_REPLY;
  }
  return reply.length > MAX_REPLY_CHARS ? `${reply.slice(0, MAX_REPLY_CHARS)}…` : reply;
}

/**
 * @param {ReturnType<import('../config.js').getConfig>} config
 * @param {{ models: { generateContent: Function } }} [client] - injectable for tests
 */
export function createAiService(config, client) {
  const genai = client ?? (config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null);

  return {
    isConfigured: () => Boolean(genai),

    /**
     * @param {{ message: string, history: { role: 'user'|'assistant', content: string }[] }} input
     *   already validated by middleware/validateChat.js
     * @returns {Promise<string>}
     */
    async reply({ message, history }) {
      if (!genai) {
        log('provider_not_configured', { hint: 'set GEMINI_API_KEY' });
        throw Errors.notConfigured(config.isProduction);
      }

      const previousUser = [...history].reverse().find((t) => t.role === 'user')?.content ?? '';
      const systemInstruction = buildSystemPrompt(buildContext(selectSections(message, previousUser)));

      const contents = [
        ...history.map((t) => ({ role: t.role === 'assistant' ? 'model' : 'user', parts: [{ text: t.content }] })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const generationConfig = {
        systemInstruction,
        maxOutputTokens: config.maxOutputTokens,
        temperature: 0.3,
        abortSignal: AbortSignal.timeout(config.timeoutMs),
        httpOptions: { timeout: config.timeoutMs, retryOptions: { attempts: 2, maxDelay: 2 } },
      };
      if (config.thinkingLevel) generationConfig.thinkingConfig = { thinkingLevel: config.thinkingLevel };

      let response;
      try {
        response = await genai.models.generateContent({ model: config.model, contents, config: generationConfig });
      } catch (err) {
        throw mapProviderError(err, config);
      }

      const finishReason = response?.candidates?.[0]?.finishReason;
      if (response?.promptFeedback?.blockReason || BLOCKED_FINISH_REASONS.has(finishReason)) {
        log('reply_blocked_by_provider', { finishReason });
        return FALLBACK_REPLY;
      }

      let text;
      try {
        text = response?.text;
      } catch {
        log('provider_malformed_response', {});
        throw Errors.unavailable();
      }
      return sanitizeReply(text, { apiKey: config.geminiApiKey });
    },
  };
}
