import { forwardRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatMessageList = forwardRef(({ messages }, ref) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-vscode-textMuted text-sm text-center">
            Start a conversation with Claude<br />
            or ask it to manage your todos
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={ref} />
        </>
      )}
    </div>
  );
});

ChatMessageList.displayName = 'ChatMessageList';

export default ChatMessageList;
