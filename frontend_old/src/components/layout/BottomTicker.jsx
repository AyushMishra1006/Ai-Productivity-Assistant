import { useTodoStore } from '../../store/todoStore';

export default function BottomTicker() {
  const getHighPriorityAndOverdue = useTodoStore((state) => state.getHighPriorityAndOverdue);
  const todos = getHighPriorityAndOverdue();

  if (todos.length === 0) {
    return (
      <div className="w-full h-full flex items-center px-4 bg-vscode-sidebar text-vscode-textMuted text-xs">
        No high priority or overdue tasks
      </div>
    );
  }

  const tickerText = todos
    .map((t) => `[${t.priority.toUpperCase()}] ${t.title}${t.due_date ? ` - Due ${t.due_date}` : ''}`)
    .join(' • ');

  return (
    <div className="relative w-full h-full overflow-hidden bg-vscode-sidebar">
      <div className="absolute whitespace-nowrap animate-ticker text-vscode-text text-xs py-1 px-4">
        ▶ {tickerText} {' '}
        ▶ {tickerText} {' '}
      </div>
    </div>
  );
}
