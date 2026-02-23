import { create } from 'zustand';
import * as api from '../services/api';

export const useTodoStore = create((set) => ({
  todos: [],
  loading: false,
  error: null,
  activeFilter: 'all',

  // Fetch todos
  fetchTodos: async (filter = 'all') => {
    set({ loading: true, error: null });
    try {
      const todos = await api.fetchTodos(filter);
      set({ todos, activeFilter: filter });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Create todo
  createTodo: async (todo) => {
    set({ loading: true });
    try {
      const newTodo = await api.createTodo(todo);
      set((state) => ({ todos: [...state.todos, newTodo] }));
      return newTodo;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update todo
  updateTodo: async (id, updates) => {
    try {
      const updated = await api.updateTodo(id, updates);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t))
      }));
      return updated;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Complete todo
  completeTodo: async (id) => {
    try {
      const completed = await api.completeTodo(id);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? completed : t))
      }));
      return completed;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      await api.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Refresh todos
  refreshTodos: async () => {
    const state = useTodoStore.getState();
    await state.fetchTodos(state.activeFilter);
  },

  // Get high priority and overdue
  getHighPriorityAndOverdue: () => {
    const { todos } = useTodoStore.getState();
    const today = new Date().toISOString().split('T')[0];

    const filtered = todos.filter((t) => {
      if (t.status === 'completed') return false;
      return t.priority === 'high' || (t.due_date && t.due_date < today);
    });

    return filtered;
  },

  // Set error
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
