export const PRIORITIES = {
  high: { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low: { label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
};

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'high_priority', label: 'High Priority' },
  { id: 'backlog', label: 'Backlog' }
];

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
