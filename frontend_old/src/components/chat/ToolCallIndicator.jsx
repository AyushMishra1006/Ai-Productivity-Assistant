export default function ToolCallIndicator({ toolName }) {
  const displayName = toolName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="mt-2 text-xs opacity-75">
      <div className="flex items-center gap-1">
        <div className="inline-block w-2 h-2 rounded-full bg-current animate-pulse"></div>
        {displayName}...
      </div>
    </div>
  );
}
