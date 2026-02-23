import { useTodoStore } from '../../store/todoStore';
import { FILTERS } from '../../constants';

export default function TodoFilters() {
  const activeFilter = useTodoStore((state) => state.activeFilter);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => fetchTodos(filter.id)}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all transform ${
            activeFilter === filter.id
              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-card scale-105'
              : 'bg-brand-surface text-brand-textMuted hover:text-brand-text border border-brand-border/50 hover:border-brand-primary/50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
