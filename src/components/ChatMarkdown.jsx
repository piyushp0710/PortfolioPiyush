// Minimal, safe markdown for assistant replies: headings, **bold** section
// labels, bullet/numbered lists, inline **bold**, `code` and auto-links.
// Builds React elements only — never injects HTML.

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function renderLink(token, key) {
  const url = token.replace(/[.,;:]+$/, '');
  const trailing = token.slice(url.length);
  const href = url.includes('@') && !url.startsWith('http') ? `mailto:${url}` : url;
  return (
    <span key={key}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300 break-all">
        {url}
      </a>
      {trailing}
    </span>
  );
}

function renderInline(text, keyPrefix) {
  return text.split(INLINE_PATTERN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (i % 2 === 0) return part;
    if (part.startsWith('**')) return <strong key={key} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={key} className="px-1 py-0.5 rounded bg-white/10 text-[0.85em] font-mono">{part.slice(1, -1)}</code>;
    return renderLink(part, key);
  });
}

const HEADING = /^#{1,4}\s+(.+)$/;
const LABEL_HEADING = /^\*\*([^*]+)\*\*:?$/;
const BULLET = /^[-*•]\s+(.+)$/;
const NUMBERED = /^\d+[.)]\s+(.+)$/;

/** Group lines into heading / paragraph / list blocks. */
function parseBlocks(text) {
  const blocks = [];
  let list = null;
  let paragraph = null;

  const flush = () => {
    list = null;
    paragraph = null;
  };

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }

    const heading = line.match(HEADING) ?? line.match(LABEL_HEADING);
    if (heading) {
      flush();
      blocks.push({ type: 'heading', text: heading[1].replace(/:$/, '') });
      continue;
    }

    const bullet = line.match(BULLET);
    const numbered = !bullet && line.match(NUMBERED);
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        paragraph = null;
        list = { type, items: [] };
        blocks.push(list);
      }
      list.items.push({ text: (bullet ?? numbered)[1], nested: /^\s{2,}/.test(rawLine) });
      continue;
    }

    if (paragraph) {
      paragraph.text += ` ${line}`;
    } else {
      list = null;
      paragraph = { type: 'p', text: line };
      blocks.push(paragraph);
    }
  }
  return blocks;
}

/** @param {{ text: string, cursor?: import('react').ReactNode }} props - cursor renders after the last word */
export default function ChatMarkdown({ text, cursor = null }) {
  // While typing, a half-revealed "**Ski" would flash raw asterisks; drop the dangling marker.
  const markers = text.match(/\*\*/g)?.length ?? 0;
  const safeText = markers % 2 ? text.replace(/\*\*(?!.*\*\*)/s, '') : text;

  const blocks = parseBlocks(safeText);
  return blocks.map((block, bi) => {
    const tail = bi === blocks.length - 1 ? cursor : null;
    if (block.type === 'heading') {
      return (
        <p key={bi} className="mt-3 first:mt-0 mb-1 text-[0.8rem] font-semibold uppercase tracking-wide text-blue-300">
          {renderInline(block.text, bi)}
          {tail}
        </p>
      );
    }
    if (block.type === 'p') {
      return (
        <p key={bi} className="mt-2 first:mt-0">
          {renderInline(block.text, bi)}
          {tail}
        </p>
      );
    }
    const ListTag = block.type;
    return (
      <ListTag key={bi} className={`mt-1.5 first:mt-0 space-y-1 ${ListTag === 'ol' ? 'list-decimal pl-5 marker:text-gray-500' : ''}`}>
        {block.items.map((item, ii) => (
          <li key={ii} className={`${ListTag === 'ul' ? 'flex gap-2' : ''} ${item.nested ? 'ml-4' : ''}`}>
            {ListTag === 'ul' && <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" aria-hidden="true" />}
            <span>
              {renderInline(item.text, `${bi}-${ii}`)}
              {ii === block.items.length - 1 && tail}
            </span>
          </li>
        ))}
      </ListTag>
    );
  });
}
