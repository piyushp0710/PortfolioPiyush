// Local development API server. Vite proxies /api to this port (vite.config.js).
try {
  process.loadEnvFile();
} catch {
  // no .env file: rely on the shell environment
}

const { createApp } = await import('./app.js');
const { getConfig } = await import('./config.js');

const port = Number(process.env.API_PORT) || 3001;
const config = getConfig();

createApp({ config }).listen(port, () => {
  console.log(`[api] listening on http://localhost:${port} (model: ${config.model}, key ${config.geminiApiKey ? 'set' : 'MISSING'})`);
});
