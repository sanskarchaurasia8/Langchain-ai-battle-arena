import { useRef, useEffect } from 'react';
import { Send, Zap } from 'lucide-react';

export default function ChatSection({ messages, inputValue, isLoading, onInputChange, onSend }) {
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-section">
      {messages.length > 0 && (
        <div className="chat-history" ref={historyRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message`}
            >
              <div className={`chat-avatar ${msg.type === 'user' ? 'user-avatar' : 'system-avatar'}`}>
                {msg.type === 'user' ? '👤' : '⚡'}
              </div>
              <div className={`chat-bubble ${msg.type === 'user' ? 'user-bubble' : 'system-bubble'}`}>
                {msg.isTyping ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {msg.text}
                    <span className="loading-dots">
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                    </span>
                  </span>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <span className="chat-input-icon">
            <Zap size={14} />
          </span>
          <input
            id="chat-input"
            className="chat-input"
            type="text"
            placeholder="Ask a coding question..."
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Chat input"
          />
        </div>
        <button
          id="send-btn"
          className="chat-send-btn"
          onClick={() => onSend()}
          disabled={isLoading || !inputValue.trim()}
        >
          <Send size={13} />
          Send
        </button>
      </div>
    </div>
  );
}
