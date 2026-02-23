import { useTodoStore } from '../../store/todoStore';
import PriorityBadge from './PriorityBadge';
import { Check, Trash2 } from 'lucide-react';

export default function TodoCard({ todo }) {
  const completeTodo = useTodoStore((state) => state.completeTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date();
  const isCompleted = todo.status === 'completed';

  const handleComplete = () => completeTodo(todo.id);
  const handleDelete = () => deleteTodo(todo.id);

  return (
    <div
      className={`p-3 border rounded transition-colors ${
        isCompleted
          ? 'bg-vscode-inputBg/30 border-vscode-border/30 opacity-50'
          : 'bg-vscode-inputBg border-vscode-border hover:border-vscode-accent'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={todo.priority} />
            <span className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-vscode-textMuted' : ''}`}>
              {todo.title}
            </span>
          </div>
          {todo.due_date && (
            <div className={`text-xs ${isOverdue ? 'text-red-400 font-semibold' : 'text-vscode-textMuted'}`}>
              Due: {todo.due_date}
              {isOverdue && ' (OVERDUE)'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={handleComplete}
            className="p-1 hover:bg-vscode-hover rounded transition-colors text-vscode-text hover:text-vscode-accent"
            title="Complete"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-vscode-hover rounded transition-colors text-vscode-text hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
