import { useState } from 'react';
import { FiMessageSquare, FiTrash2, FiPlus } from 'react-icons/fi';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e1a]';

function formatWhen(timestamp) {
  const diffMin = Math.round((Date.now() - timestamp) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** List of this visitor's saved conversations (browser-only storage). */
export default function ChatHistory({ conversations, currentId, available, onOpen, onDelete, onClearAll, onNewChat }) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-xs font-mono tracking-wider text-gray-500 uppercase">Your conversations</h3>
        <button
          type="button"
          onClick={onNewChat}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:text-white transition-all ${FOCUS}`}
        >
          <FiPlus size={12} /> New chat
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-3">
        {!available ? (
          <p className="px-2 py-8 text-center text-sm text-gray-500">
            History isn&apos;t available in this browser (storage is blocked or in private mode).
          </p>
        ) : conversations.length === 0 ? (
          <div className="px-2 py-10 text-center text-sm text-gray-500">
            <FiMessageSquare size={22} className="mx-auto mb-3 text-gray-600" aria-hidden="true" />
            No saved conversations yet. Your chats will appear here.
          </div>
        ) : (
          <ul className="space-y-1" aria-label="Saved conversations">
            {conversations.map((c) => {
              const current = c.id === currentId;
              const questions = c.messages.filter((m) => m.role === 'user').length;
              return (
                <li key={c.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpen(c.id)}
                    aria-current={current ? 'true' : undefined}
                    className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-xl border transition-all ${FOCUS} ${
                      current
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                    }`}
                  >
                    <span className="block text-sm text-gray-200 truncate">{c.title}</span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">
                      {formatWhen(c.updatedAt)} · {questions} {questions === 1 ? 'question' : 'questions'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(c.id)}
                    aria-label={`Delete conversation: ${c.title}`}
                    title="Delete"
                    className={`p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-all ${FOCUS}`}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-white/5 px-4 py-3 bg-[#080810]/60 flex items-center justify-between gap-3">
        <p className="text-[11px] text-gray-500">Saved only in this browser.</p>
        {conversations.length > 0 &&
          (confirmingClear ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmingClear(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all ${FOCUS}`}
              >
                Delete all
              </button>
              <button
                type="button"
                onClick={() => setConfirmingClear(false)}
                className={`px-2.5 py-1 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-all ${FOCUS}`}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className={`px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${FOCUS}`}
            >
              Clear history
            </button>
          ))}
      </div>
    </div>
  );
}
