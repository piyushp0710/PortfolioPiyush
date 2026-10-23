// Vercel Function entry. vercel.json rewrites /api/* here; Express routes on
// the original path. Secrets come from Vercel Environment Variables.
import { createApp } from '../server/app.js';

export default createApp();
