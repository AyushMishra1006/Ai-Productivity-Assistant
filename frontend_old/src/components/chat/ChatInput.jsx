import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-brand-border/50 bg-brand-surface">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-brand-inputBg border border-brand-border/50 rounded-lg text-brand-text text-sm placeholder:text-brand-textMuted resize-none focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50 transition-all"
          rows="3"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-3 py-3 bg-gradient-to-br from-brand-primary to-brand-secondary hover:shadow-card disabled:bg-brand-inputBg text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 font-semibold shadow-card disabled:shadow-none"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}
