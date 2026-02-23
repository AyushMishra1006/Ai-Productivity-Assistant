import { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { MessageCircle, Zap } from 'lucide-react';

export default function ChatPanel() {
  const { messages, loading, error, sendMessage, setError } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-brand-darker">
      {/* Modern Header with Gradient */}
      <div className="p-5 border-b border-brand-border/50 bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-warning">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">Mistral AI Chat</h3>
        </div>
        <p className="text-white/80 text-xs ml-11">💬 Instant task management</p>
      </div>

      {/* Error - Modern Style */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-brand-danger/10 border border-brand-danger/50 rounded-lg text-brand-danger text-sm animate-slide-in">
          <div className="flex items-start justify-between">
            <div>⚠️ <strong>Error:</strong> {error}</div>
            <button
              onClick={() => setError(null)}
              className="font-bold hover:opacity-70 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div>
            <MessageCircle size={56} className="text-brand-primary/60 mx-auto mb-4" />
            <p className="text-brand-text font-bold text-xl mb-2">Ready to chat?</p>
            <p className="text-brand-textMuted mb-6">Try commands like:</p>
            <ul className="text-sm text-brand-textMuted space-y-2">
              <li>✓ <span className="text-brand-text">"Add buy groceries"</span></li>
              <li>✓ <span className="text-brand-text">"What's on my list?"</span></li>
              <li>✓ <span className="text-brand-text">"Mark task as done"</span></li>
            </ul>
          </div>
        </div>
      )}

      {/* Messages */}
      <ChatMessageList messages={messages} ref={messagesEndRef} />

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} disabled={loading} />
    </div>
  );
}
