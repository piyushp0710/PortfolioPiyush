// Visitor chat history, stored only in this browser (localStorage).
// Everything read back is treated as untrusted and re-validated: storage can
// be edited by hand, corrupted, full, or unavailable (private mode).

const STORAGE_KEY = 'pp-chat-history-v1';
export const HISTORY_STORAGE_KEY = STORAGE_KEY;
export const MAX_CONVERSATIONS = 20;
export const MAX_MESSAGES_PER_CONVERSATION = 50;
const MAX_CONTENT_CHARS = 8000;
const TITLE_CHARS = 48;

function defaultStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // access can throw when site data is blocked
  }
}

/** True when this browser lets us save history. */
export function isHistoryAvailable(storage = defaultStorage()) {
  if (!storage) return false;
  try {
    const probe = `${STORAGE_KEY}-probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const isString = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;

function sanitizeMessage(m) {
  if (!m || !isString(m.id, 64) || !['user', 'assistant'].includes(m.role) || !isString(m.content, MAX_CONTENT_CHARS)) return null;
  return { id: m.id, role: m.role, content: m.content };
}

function sanitizeConversation(c) {
  if (!c || !isString(c.id, 64) || !Array.isArray(c.messages)) return null;
  const messages = c.messages.map(sanitizeMessage).filter(Boolean).slice(-MAX_MESSAGES_PER_CONVERSATION);
  if (!messages.some((m) => m.role === 'user')) return null;
  const now = Date.now();
  return {
    id: c.id,
    title: isString(c.title, 200) ? c.title.slice(0, TITLE_CHARS + 1) : makeTitle(messages.find((m) => m.role === 'user').content),
    createdAt: Number.isFinite(c.createdAt) ? c.createdAt : now,
    updatedAt: Number.isFinite(c.updatedAt) ? c.updatedAt : now,
    messages,
  };
}

/** Conversation title from the first question, single line and short. */
export function makeTitle(text) {
  const line = text.replace(/\s+/g, ' ').trim();
  return line.length > TITLE_CHARS ? `${line.slice(0, TITLE_CHARS).trimEnd()}…` : line;
}

/** @returns {Array<{id, title, createdAt, updatedAt, messages}>} newest first */
export function loadConversations(storage = defaultStorage()) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeConversation)
      .filter(Boolean)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CONVERSATIONS);
  } catch {
    return [];
  }
}

function write(list, storage) {
  if (list.length === 0) return clearConversations(storage);
  queueMicrotask(notify);
  // If storage is full, drop the oldest conversations until it fits.
  for (let keep = list.length; keep > 0; keep--) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, keep)));
      return list.slice(0, keep);
    } catch {
      // QuotaExceededError or storage disabled: retry with fewer
    }
  }
  return loadConversations(storage);
}

/** Insert or update a conversation; returns the new list (newest first). */
export function saveConversation(conversation, storage = defaultStorage()) {
  if (!storage) return [];
  const clean = sanitizeConversation(conversation);
  if (!clean) return loadConversations(storage);
  const others = loadConversations(storage).filter((c) => c.id !== clean.id);
  const list = [clean, ...others].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CONVERSATIONS);
  return write(list, storage);
}

export function deleteConversation(id, storage = defaultStorage()) {
  if (!storage) return [];
  return write(loadConversations(storage).filter((c) => c.id !== id), storage);
}

export function clearConversations(storage = defaultStorage()) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
  queueMicrotask(notify);
  return [];
}

// --- Subscription API for React (useSyncExternalStore) ---------------------

const listeners = new Set();
let cachedRaw;
let cachedList = [];

function notify() {
  listeners.forEach((listener) => listener());
}

/** Subscribe to history changes in this tab and in other tabs. */
export function subscribeHistory(listener) {
  listeners.add(listener);
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Stable snapshot: same array instance until the stored data changes. */
export function getHistorySnapshot() {
  let raw = null;
  try {
    raw = defaultStorage()?.getItem(STORAGE_KEY) ?? null;
  } catch {
    // unavailable storage behaves like empty history
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = loadConversations();
  }
  return cachedList;
}
