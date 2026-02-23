import { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';

export default function TodoForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const createTodo = useTodoStore((state) => state.createTodo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createTodo({
        title: title.trim(),
        priority,
        due_date: dueDate || undefined
      });
      onClose();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-vscode-text text-sm placeholder:text-vscode-textMuted focus:outline-none focus:border-vscode-accent"
        autoFocus
      />

      <div className="flex gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-vscode-text text-sm focus:outline-none focus:border-vscode-accent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 px-3 py-2 bg-vscode-bg border border-vscode-border rounded text-vscode-text text-sm focus:outline-none focus:border-vscode-accent"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-3 py-2 bg-vscode-accent hover:bg-blue-600 disabled:bg-vscode-border text-white rounded text-sm transition-colors"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-3 py-2 bg-vscode-inputBg hover:bg-vscode-hover text-vscode-text rounded text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
