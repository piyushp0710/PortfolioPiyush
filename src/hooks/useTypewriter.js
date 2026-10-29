import { useEffect, useState } from 'react';

const TICK_MS = 16;
const TARGET_DURATION_MS = 900;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveal text word by word, ChatGPT-style. Long replies speed up so any
 * answer finishes in about a second. Respects prefers-reduced-motion.
 * @returns {{ shown: string, done: boolean }}
 */
export function useTypewriter(text, enabled, onTick) {
  const [count, setCount] = useState(0);
  // Split keeping whitespace so newlines (lists, headings) survive.
  const tokens = text.split(/(\s+)/);
  const animate = enabled && !prefersReducedMotion();

  useEffect(() => {
    if (!animate) return;
    const perTick = Math.max(1, Math.ceil(tokens.length / (TARGET_DURATION_MS / TICK_MS)));
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + perTick, tokens.length);
        if (next >= tokens.length) clearInterval(timer);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [animate, tokens.length]);

  useEffect(() => {
    if (animate) onTick?.();
  }, [animate, count, onTick]);

  const done = !animate || count >= tokens.length;
  return { shown: done ? text : tokens.slice(0, count).join(''), done };
}
