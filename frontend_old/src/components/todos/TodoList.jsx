import { useTodoStore } from '../../store/todoStore';
import TodoCard from './TodoCard';

export default function TodoList() {
  const todos = useTodoStore((state) => state.todos);

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
