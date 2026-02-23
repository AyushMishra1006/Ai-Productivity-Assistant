import { useEffect } from 'react';
import './styles/globals.css';
import AppShell from './components/layout/AppShell';
import { useTodoStore } from './store/todoStore';

function App() {
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="w-full h-screen bg-vscode-bg text-vscode-text">
      <AppShell />
    </div>
  );
}

export default App;
