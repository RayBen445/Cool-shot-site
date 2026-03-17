interface TerminalPanelProps {
  logs: string[];
  onClear: () => void;
}

export function TerminalPanel({ logs, onClear }: TerminalPanelProps) {
  return (
    <div className="h-full w-full flex flex-col bg-gray-900 overflow-hidden">
      <div className="bg-gray-950 border-b border-t border-gray-800 px-4 py-1.5 flex justify-between items-center text-xs text-gray-400">
        <span>Console</span>
        <button
          onClick={onClear}
          className="hover:text-white px-2 py-0.5 rounded transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {logs.map((log, i) => (
          <div key={i} className="text-gray-300 border-b border-gray-800/50 pb-1 mb-1 break-words">
            {log}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-600 italic">No output...</div>
        )}
      </div>
    </div>
  );
}
