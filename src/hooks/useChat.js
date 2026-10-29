import { useCallback, useEffect, useRef, useState } from 'react';

export const MAX_MESSAGE_CHARS = 1000;
const HISTORY_TURNS = 10;
const REQUEST_TIMEOUT_MS = 30000;

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Piyush's portfolio assistant. Ask me about his skills, experience, projects or how to reach him. You can ask in English or Hindi.",
};

let nextId = 0;
const makeId = () => `m${Date.now()}-${nextId++}`;

async function postChat(message, history, signal) {
  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error("Couldn't reach the assistant. Check your connection and try again.", { cause: err });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || typeof data?.reply !== 'string') {
    throw new Error(data?.error?.message || 'The assistant could not answer right now. Please try again.');
  }
  return data.reply;
}

/**
 * Conversation state for the portfolio chat widget. Kept in memory only:
 * nothing is persisted between page loads.
 */
export function useChat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // { message, retryText }
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const request = useCallback(async (text, priorMessages) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS);

    const history = priorMessages
      .filter((m) => m.id !== WELCOME.id)
      .slice(-HISTORY_TURNS)
      .map(({ role, content }) => ({ role, content }));

    setLoading(true);
    setError(null);
    try {
      const reply = await postChat(text, history, controller.signal);
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: reply, animate: true }]);
    } catch (err) {
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return; // reset / unmount
      setError({
        message: controller.signal.reason === 'timeout' ? 'The assistant took too long to respond. Please try again.' : err.message,
        retryText: text,
      });
    } finally {
      clearTimeout(timer);
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  const send = useCallback(
    (rawText) => {
      const text = rawText.trim();
      if (!text || loading || text.length > MAX_MESSAGE_CHARS) return false;
      const prior = messages;
      setMessages([...prior, { id: makeId(), role: 'user', content: text }]);
      request(text, prior);
      return true;
    },
    [loading, messages, request],
  );

  // Re-ask the failed question without adding a duplicate user bubble.
  const retry = useCallback(() => {
    if (!error || loading) return;
    request(error.retryText, messages.slice(0, -1));
  }, [error, loading, messages, request]);

  // Typing animation finished: never replay it (e.g. after reopening the panel).
  const markShown = useCallback((id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, animate: false } : m)));
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
    setError(null);
    setMessages([WELCOME]);
  }, []);

  return { messages, loading, error, send, retry, reset, markShown, hasConversation: messages.length > 1 };
}
