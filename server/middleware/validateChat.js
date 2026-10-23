import { LIMITS } from '../config.js';
import { Errors } from '../errors.js';

// Strip control characters except tab/newline, normalize line endings and Unicode.
function normalizeText(value) {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F\u200B\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Validate and normalize a chat request body. Only `message` and `history`
 * are read; any other fields (model, system prompt, data...) are ignored.
 * @returns {{ message: string, history: { role: 'user'|'assistant', content: string }[] }}
 * @throws {import('../errors.js').AppError}
 */
export function parseChatRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Errors.invalidRequest('Request body must be a JSON object.');
  }

  if (typeof body.message !== 'string') throw Errors.invalidRequest('"message" must be a string.');
  const message = normalizeText(body.message);
  if (!message) throw Errors.invalidRequest('Message cannot be empty.');
  if (message.length > LIMITS.messageMaxChars) {
    throw Errors.invalidRequest(`Message is too long (max ${LIMITS.messageMaxChars} characters).`);
  }

  const rawHistory = body.history ?? [];
  if (!Array.isArray(rawHistory)) throw Errors.invalidRequest('"history" must be an array.');
  if (rawHistory.length > LIMITS.historyAcceptMaxTurns) throw Errors.invalidRequest('History is too long.');

  const history = rawHistory.map((turn) => {
    if (!turn || typeof turn !== 'object' || !['user', 'assistant'].includes(turn.role) || typeof turn.content !== 'string') {
      throw Errors.invalidRequest('Each history item must be { role: "user" | "assistant", content: string }.');
    }
    const content = normalizeText(turn.content);
    if (content.length > LIMITS.historyItemMaxChars) throw Errors.invalidRequest('A history item is too long.');
    return { role: turn.role, content };
  }).filter((turn) => turn.content);

  // Keep only the most recent turns within the total character budget,
  // and start on a user turn so the provider sees a well-formed dialogue.
  const recent = [];
  let total = 0;
  for (const turn of history.slice(-LIMITS.historyMaxTurns).reverse()) {
    if (total + turn.content.length > LIMITS.historyTotalMaxChars) break;
    total += turn.content.length;
    recent.unshift(turn);
  }
  while (recent.length && recent[0].role !== 'user') recent.shift();

  return { message, history: recent };
}

export function validateChat(req, _res, next) {
  try {
    req.chat = parseChatRequest(req.body);
    next();
  } catch (err) {
    next(err);
  }
}
