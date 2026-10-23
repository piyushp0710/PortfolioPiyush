import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiRefreshCw, FiArrowDown, FiAlertCircle } from 'react-icons/fi';
import { useChat, MAX_MESSAGE_CHARS } from '../hooks/useChat';

const SUGGESTIONS = [
  'Who is Piyush?',
  'What are his technical skills?',
  'Tell me about his work experience.',
  'What projects has he built?',
  'What is his experience with AI?',
  'How can I contact him?',
  'Is he available for relevant opportunities?',
];

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e1a]';

const LINK_PATTERN = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

// Plain-text rendering with safe auto-linking (no HTML injection).
function MessageText({ text }) {
  const clean = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');
  return clean.split(LINK_PATTERN).map((part, i) => {
    if (i % 2 === 0) return part;
    const url = part.replace(/[.,;:]+$/, '');
    const trailing = part.slice(url.length);
    const href = url.includes('@') && !url.startsWith('http') ? `mailto:${url}` : url;
    return (
      <span key={i}>
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300 break-all">
          {url}
        </a>
        {trailing}
      </span>
    );
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-[#13131f] border border-white/5 w-fit" role="status">
      <span className="sr-only">Assistant is typing</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-violet-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [atBottom, setAtBottom] = useState(true);
  const { messages, loading, error, send, retry, reset, hasConversation } = useChat();

  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Full-screen on phones: stop the page behind from scrolling.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Follow new messages only if the reader is already at the bottom.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el && atBottom) el.scrollTop = el.scrollHeight;
  }, [messages, loading, error, atBottom, open]);

  const handleScroll = () => {
    const el = listRef.current;
    if (el) setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 48);
  };

  const scrollToLatest = () => {
    const el = listRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setAtBottom(true);
  };

  // Grow the textarea with its content, up to ~5 lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  const submit = (text) => {
    if (send(text)) {
      setInput('');
      setAtBottom(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(input);
    }
  };

  const handleReset = () => {
    reset();
    setInput('');
    setAtBottom(true);
    inputRef.current?.focus();
  };

  const remaining = MAX_MESSAGE_CHARS - input.length;
  const canSend = input.trim().length > 0 && remaining >= 0 && !loading;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            id="portfolio-chat"
            role="dialog"
            aria-labelledby="portfolio-chat-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[60] inset-0 sm:inset-auto sm:bottom-28 sm:right-8 sm:w-[400px] sm:h-[min(620px,calc(100dvh-9rem))] flex flex-col bg-[#0e0e1a] sm:rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#080810]/60">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0" aria-hidden="true">
                PP
              </div>
              <div className="flex-1 min-w-0">
                <h2 id="portfolio-chat-title" className="text-sm font-semibold text-white">Ask about Piyush</h2>
                <p className="text-xs text-gray-400 truncate">AI assistant · answers from his portfolio</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasConversation && !error}
                className={`p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all ${FOCUS}`}
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <FiRefreshCw size={16} />
              </button>
              <button
                type="button"
                onClick={close}
                className={`p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all ${FOCUS}`}
                aria-label="Close chat"
                title="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="relative flex-1 min-h-0">
              <div
                ref={listRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
                className="h-full overflow-y-auto overscroll-contain px-4 py-4 space-y-3"
              >
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        m.role === 'user'
                          ? 'rounded-2xl rounded-br-md bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                          : 'rounded-2xl rounded-bl-md bg-[#13131f] border border-white/5 text-gray-200'
                      }`}
                    >
                      <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Assistant: '}</span>
                      {m.role === 'assistant' ? <MessageText text={m.content} /> : m.content}
                    </div>
                  </div>
                ))}

                {!hasConversation && !loading && (
                  <div className="pt-1">
                    <p className="text-xs font-mono tracking-wider text-gray-500 uppercase mb-2">Try asking</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => submit(q)}
                          className={`px-3 py-1.5 rounded-full text-xs text-left bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all ${FOCUS}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && <TypingIndicator />}

                {error && !loading && (
                  <div role="alert" className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-200">
                    <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-400" aria-hidden="true" />
                    <div className="flex-1">
                      <p>{error.message}</p>
                      <button
                        type="button"
                        onClick={retry}
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all ${FOCUS}`}
                      >
                        <FiRefreshCw size={12} /> Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!atBottom && (
                <button
                  type="button"
                  onClick={scrollToLatest}
                  className={`absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[#13131f] border border-white/10 text-gray-200 shadow-lg hover:border-blue-500/40 ${FOCUS}`}
                >
                  <FiArrowDown size={12} /> Latest
                </button>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-white/5 p-3 bg-[#080810]/60"
            >
              <div className="flex items-end gap-2">
                <label htmlFor="portfolio-chat-input" className="sr-only">
                  Ask a question about Piyush
                </label>
                <textarea
                  id="portfolio-chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects, experience…"
                  aria-describedby="portfolio-chat-hint"
                  className="flex-1 resize-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className={`p-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all ${FOCUS}`}
                  aria-label="Send message"
                >
                  <FiSend size={16} />
                </button>
              </div>
              <div id="portfolio-chat-hint" className="flex justify-between mt-2 px-1 text-[11px] text-gray-500">
                <span>AI can make mistakes. Verify important details with Piyush.</span>
                {remaining < 200 && (
                  <span className={remaining < 0 ? 'text-red-400' : ''} aria-live="polite">
                    {remaining}
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-expanded={open}
        aria-controls="portfolio-chat"
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow items-center justify-center ${
          open ? 'hidden sm:flex' : 'flex'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080810]`}
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={24} />}
      </motion.button>
    </>
  );
}
