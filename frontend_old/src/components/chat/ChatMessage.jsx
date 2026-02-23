import ToolCallIndicator from './ToolCallIndicator';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs px-3 py-2 rounded text-sm ${
          isUser
            ? 'bg-vscode-accent text-white'
            : 'bg-vscode-inputBg text-vscode-text'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.toolCalling && (
          <ToolCallIndicator toolName={message.toolName} />
        )}
      </div>
    </div>
  );
}
