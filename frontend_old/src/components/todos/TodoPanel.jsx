import { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';
import TodoFilters from './TodoFilters';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { Plus, CheckSquare } from 'lucide-react';

export default function TodoPanel() {
  const [showForm, setShowForm] = useState(false);
  const todos = useTodoStore((state) => state.todos);
  const error = useTodoStore((state) => state.error);

  return (
    <div className="h-full flex flex-col bg-brand-darker">
      {/* Modern Header with gradient */}
      <div className="p-6 border-b border-brand-border/50 bg-gradient-to-br from-brand-surface to-brand-darker">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">My Tasks</h2>
          <span className="ml-auto bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-card">
            {todos.length} Tasks
          </span>
        </div>
        <TodoFilters />
      </div>

      {/* Error Message - Stylish */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-brand-danger/10 border border-brand-danger/50 rounded-lg text-brand-danger text-sm font-medium animate-slide-in">
          ⚠️ {error}
        </div>
      )}

      {/* Todo List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {todos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">📝</div>
              <p className="text-brand-text text-lg font-semibold mb-1">No tasks yet</p>
              <p className="text-brand-textMuted">Create your first todo to get started</p>
            </div>
          </div>
        ) : (
          <TodoList />
        )}
      </div>

      {/* Add Button & Form */}
      {showForm ? (
        <div className="p-4 border-t border-brand-border/50 bg-brand-surface">
          <TodoForm onClose={() => setShowForm(false)} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mx-4 mb-4 flex items-center justify-center gap-2 w-11/12 px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-card text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-card active:scale-95"
        >
          <Plus size={20} /> Add Task
        </button>
      )}
    </div>
  );
}
