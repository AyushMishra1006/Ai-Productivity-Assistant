import { API_URL } from '../constants';

const API_BASE = API_URL;

export async function fetchTodos(filter = 'all') {
  const response = await fetch(`${API_BASE}/todos?filter=${filter}`);
  if (!response.ok) throw new Error(`Failed to fetch todos: ${response.statusText}`);
  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error(`Failed to create todo: ${response.statusText}`);
  return response.json();
}

export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error(`Failed to update todo: ${response.statusText}`);
  return response.json();
}

export async function completeTodo(id) {
  const response = await fetch(`${API_BASE}/todos/${id}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error(`Failed to complete todo: ${response.statusText}`);
  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error(`Failed to delete todo: ${response.statusText}`);
  return response.json();
}

export async function* streamChat(messages, conversationHistory = []) {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      conversation_history: conversationHistory
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to start chat: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    yield decoder.decode(value, { stream: true });
  }

  // Ensure remaining data is flushed
  yield decoder.decode();
}
