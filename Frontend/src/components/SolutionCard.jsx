import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-wrapper">
      <div className="code-toolbar">
        <span className="code-lang-badge">{language}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-content">
        <code dangerouslySetInnerHTML={{ __html: highlightJS(code) }} />
      </pre>
    </div>
  );
}

// Simple JS/Python syntax highlighter with correct ordering (escape first, then highlight)
function highlightJS(code) {
  // Step 1: Escape HTML special chars
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 2: Apply highlighting using placeholder tokens to avoid re-matching
  const tokens = [];
  let tokenized = escaped;

  const addToken = (cls, content) => {
    const id = `\x00TOKEN${tokens.length}\x00`;
    tokens.push(`<span class="${cls}">${content}</span>`);
    return id;
  };

  // Comments first (highest priority)
  tokenized = tokenized.replace(/(\/\/[^\n]*)/g, (m) => addToken('hljs-comment', m));
  tokenized = tokenized.replace(/(#[^\n]*)/g, (m) => addToken('hljs-comment', m));

  // Strings
  tokenized = tokenized.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, (m) => addToken('hljs-string', m));

  // Keywords
  tokenized = tokenized.replace(/\b(function|return|const|let|var|if|else|for|while|throw|new|class|import|export|default|async|await|of|in|def|elif|and|or|not|True|False|None|pass|lambda|yield|with|as|try|except|finally|raise|from|global|nonlocal|del|is)\b/g, (m) => addToken('hljs-keyword', m));

  // Numbers
  tokenized = tokenized.replace(/\b(\d+\.?\d*)\b/g, (m) => addToken('hljs-number', m));

  // Built-ins
  tokenized = tokenized.replace(/\b(console|Math|Error|NaN|undefined|null|true|false|print|len|range|list|dict|set|int|str|float|bool|type|isinstance|append|extend)\b/g, (m) => addToken('hljs-built_in', m));

  // Replace tokens with spans
  tokens.forEach((span, i) => {
    tokenized = tokenized.replace(`\x00TOKEN${i}\x00`, span);
  });

  return tokenized;
}

// Custom markdown renderer that extracts code blocks
function MarkdownContent({ content, cardClass }) {
  const parts = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: 'text', content: textBefore, key: `text-${lastIndex}` });
      }
    }
    parts.push({ type: 'code', lang: match[1] || 'javascript', code: match[2].trim(), key: `code-${match.index}` });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex);
    if (remaining.trim()) {
      parts.push({ type: 'text', content: remaining, key: `text-end` });
    }
  }

  return (
    <div className="markdown-content">
      {parts.map((part) =>
        part.type === 'code' ? (
          <CodeBlock key={part.key} code={part.code} language={part.lang} />
        ) : (
          <ReactMarkdown key={part.key} remarkPlugins={[remarkGfm]}>
            {part.content}
          </ReactMarkdown>
        )
      )}
    </div>
  );
}

export default function SolutionCard({ solution, cardIndex, score, tags }) {
  const isCard1 = cardIndex === 1;
  const cardCls = `solution-card card-${cardIndex}`;
  const badgeCls = `score-badge badge-${cardIndex}`;
  const icon = isCard1 ? '🤖' : '💡';
  const subtitle = isCard1 ? 'GPT-4 · Recursive Logic' : 'Claude 3 · Iterative Process';

  return (
    <div id={`solution-card-${cardIndex}`} className={cardCls}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-header-icon">{icon}</div>
          <div className="card-header-info">
            <span className="card-title">Solution {cardIndex}</span>
            <span className="card-subtitle">{subtitle}</span>
          </div>
        </div>
        <div className={badgeCls}>
          <span className="score-icon">⚡</span>
          {score}/10
        </div>
      </div>

      <div className="card-body">
        <MarkdownContent content={solution} cardClass={`card-${cardIndex}`} />

        {tags && (
          <div className="card-tags">
            {tags.map(tag => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
