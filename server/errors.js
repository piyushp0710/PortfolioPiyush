// Consistent, visitor-safe API errors: { error: { code, message } }.

export class AppError extends Error {
  /**
   * @param {string} code - stable machine-readable code
   * @param {number} status - HTTP status
   * @param {string} message - safe to show to visitors
   */
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const Errors = {
  invalidRequest: (message) => new AppError('INVALID_REQUEST', 400, message),
  forbiddenOrigin: () => new AppError('FORBIDDEN_ORIGIN', 403, 'This origin is not allowed to use the chat API.'),
  notFound: () => new AppError('NOT_FOUND', 404, 'Not found.'),
  rateLimited: () => new AppError('RATE_LIMITED', 429, "You're sending messages too quickly. Please wait a moment and try again."),
  notConfigured: (isProduction) =>
    new AppError(
      'AI_NOT_CONFIGURED',
      503,
      isProduction
        ? 'The assistant is temporarily unavailable. Please try again later or contact Piyush directly.'
        : 'AI provider is not configured: set GEMINI_API_KEY in .env (local) or in Vercel Environment Variables, then restart the server.',
    ),
  busy: () => new AppError('AI_BUSY', 503, 'The assistant is getting a lot of questions right now. Please try again in a minute.'),
  unavailable: () => new AppError('AI_UNAVAILABLE', 502, 'The assistant could not answer right now. Please try again.'),
  timeout: () => new AppError('AI_TIMEOUT', 504, 'The assistant took too long to respond. Please try again.'),
  internal: () => new AppError('INTERNAL_ERROR', 500, 'Something went wrong. Please try again.'),
};

export function sendError(res, err) {
  res.status(err.status).json({ error: { code: err.code, message: err.message } });
}
