import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  saveConversation,
  loadConversations,
  deleteConversation,
  clearConversations,
  isHistoryAvailable,
  makeTitle,
  MAX_CONVERSATIONS,
  MAX_MESSAGES_PER_CONVERSATION,
  HISTORY_STORAGE_KEY,
} from '../../src/utils/chatStorage.js';

function memoryStorage({ quotaChars = Infinity } = {}) {
  const data = new Map();
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => {
      if (String(v).length > quotaChars) throw Object.assign(new Error('full'), { name: 'QuotaExceededError' });
      data.set(k, String(v));
    },
    removeItem: (k) => data.delete(k),
  };
}

const conv = (id, updatedAt, question = `Question ${id}`) => ({
  id,
  title: makeTitle(question),
  createdAt: updatedAt,
  updatedAt,
  messages: [
    { id: `${id}-u`, role: 'user', content: question },
    { id: `${id}-a`, role: 'assistant', content: `Answer ${id}` },
  ],
});

describe('chatStorage', () => {
  test('saves, updates and lists newest first', () => {
    const s = memoryStorage();
    saveConversation(conv('a', 1), s);
    saveConversation(conv('b', 2), s);
    saveConversation({ ...conv('a', 3), messages: [...conv('a', 3).messages, { id: 'a-u2', role: 'user', content: 'More?' }] }, s);
    const list = loadConversations(s);
    assert.deepEqual(list.map((c) => c.id), ['a', 'b']);
    assert.equal(list[0].messages.length, 3);
  });

  test(`keeps at most ${MAX_CONVERSATIONS} conversations and ${MAX_MESSAGES_PER_CONVERSATION} messages each`, () => {
    const s = memoryStorage();
    for (let i = 0; i < MAX_CONVERSATIONS + 5; i++) saveConversation(conv(`c${i}`, i), s);
    const list = loadConversations(s);
    assert.equal(list.length, MAX_CONVERSATIONS);
    assert.equal(list.at(-1).id, 'c5'); // oldest five dropped

    const long = conv('long', 100);
    long.messages = Array.from({ length: 80 }, (_, i) => ({ id: `m${i}`, role: i % 2 ? 'assistant' : 'user', content: `t${i}` }));
    saveConversation(long, s);
    assert.equal(loadConversations(s)[0].messages.length, MAX_MESSAGES_PER_CONVERSATION);
  });

  test('strips UI-only fields such as animate', () => {
    const s = memoryStorage();
    const c = conv('x', 1);
    c.messages[1].animate = true;
    saveConversation(c, s);
    assert.deepEqual(Object.keys(loadConversations(s)[0].messages[1]).sort(), ['content', 'id', 'role']);
  });

  test('ignores corrupt or tampered data', () => {
    const s = memoryStorage();
    s.setItem(HISTORY_STORAGE_KEY, '{not json');
    assert.deepEqual(loadConversations(s), []);

    s.setItem(HISTORY_STORAGE_KEY, JSON.stringify([
      { id: 'ok', updatedAt: 5, messages: [{ id: '1', role: 'user', content: 'hi' }] },
      { id: 'bad-role', messages: [{ id: '1', role: 'system', content: 'evil' }] },
      { id: 'no-messages' },
      'nonsense',
      null,
    ]));
    const list = loadConversations(s);
    assert.deepEqual(list.map((c) => c.id), ['ok']);
    assert.equal(list[0].title, 'hi'); // title rebuilt when missing
  });

  test('does not save conversations without a question', () => {
    const s = memoryStorage();
    saveConversation({ id: 'w', messages: [{ id: 'a', role: 'assistant', content: 'welcome' }] }, s);
    assert.deepEqual(loadConversations(s), []);
  });

  test('drops oldest conversations when storage is full', () => {
    const s = memoryStorage({ quotaChars: 900 });
    for (let i = 0; i < 10; i++) saveConversation(conv(`q${i}`, i, `Question number ${i} ${'x'.repeat(40)}`), s);
    const list = loadConversations(s);
    assert.ok(list.length > 0 && list.length < 10, `kept ${list.length}`);
    assert.equal(list[0].id, 'q9'); // newest kept
  });

  test('delete removes one; deleting the last clears storage', () => {
    const s = memoryStorage();
    saveConversation(conv('a', 1), s);
    saveConversation(conv('b', 2), s);
    deleteConversation('a', s);
    assert.deepEqual(loadConversations(s).map((c) => c.id), ['b']);
    deleteConversation('b', s);
    assert.equal(s.getItem(HISTORY_STORAGE_KEY), null);
  });

  test('clear removes everything', () => {
    const s = memoryStorage();
    saveConversation(conv('a', 1), s);
    clearConversations(s);
    assert.deepEqual(loadConversations(s), []);
  });

  test('unavailable storage degrades to empty history', () => {
    const blocked = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); }, removeItem: () => {} };
    assert.equal(isHistoryAvailable(blocked), false);
    assert.equal(isHistoryAvailable(null), false);
    assert.deepEqual(loadConversations(blocked), []);
    assert.deepEqual(saveConversation(conv('a', 1), null), []);
    assert.equal(isHistoryAvailable(memoryStorage()), true);
  });

  test('titles are single-line and truncated', () => {
    assert.equal(makeTitle('  Who   is\nPiyush?  '), 'Who is Piyush?');
    const t = makeTitle('a'.repeat(100));
    assert.ok(t.length <= 49 && t.endsWith('…'));
  });
});
