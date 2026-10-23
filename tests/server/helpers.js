import { createApp } from '../../server/app.js';

export const baseConfig = {
  isProduction: false,
  geminiApiKey: 'test-key-SHOULD-NEVER-LEAK',
  model: 'test-model',
  thinkingLevel: 'MINIMAL',
  maxOutputTokens: 600,
  timeoutMs: 1000,
  rateLimitPerMinute: 100,
  rateLimitPerHour: 1000,
  allowedOrigins: ['http://localhost:5173'],
};

/** Start the app on an ephemeral port; returns { url, close }. */
export async function startServer({ config = baseConfig, aiService } = {}) {
  const app = createApp({ config: { ...baseConfig, ...config }, aiService });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

export function fakeAiService(reply = async () => 'grounded answer') {
  const calls = [];
  return {
    calls,
    isConfigured: () => true,
    reply: async (input) => {
      calls.push(input);
      return reply(input);
    },
  };
}

export function postChat(url, body, headers = {}) {
  return fetch(`${url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
