import { PRIORITIES } from '../../constants';

export default function PriorityBadge({ priority }) {
  const config = PRIORITIES[priority] || PRIORITIES.low;

  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium flex-shrink-0 ${config.color}`}>
      {config.label}
    </span>
  );
}
