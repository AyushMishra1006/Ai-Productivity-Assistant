import ChatPanel from '../chat/ChatPanel';

export default function RightPanel() {
  return (
    <div className="h-full bg-vscode-sidebar flex flex-col">
      <ChatPanel />
    </div>
  );
}
