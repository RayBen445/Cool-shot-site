import { FileCode2, FileJson, FileText } from "lucide-react";

interface SidebarProps {
  files: string[];
  activeFile: string;
  onFileSelect: (filename: string) => void;
}

export function Sidebar({ files, activeFile, onFileSelect }: SidebarProps) {
  const getIcon = (filename: string) => {
    if (filename.endsWith('.html')) return <FileCode2 className="w-4 h-4 text-orange-400 mr-2" />;
    if (filename.endsWith('.css')) return <FileCode2 className="w-4 h-4 text-blue-400 mr-2" />;
    if (filename.endsWith('.js')) return <FileJson className="w-4 h-4 text-yellow-400 mr-2" />;
    if (filename.endsWith('.md')) return <FileText className="w-4 h-4 text-gray-400 mr-2" />;
    return <FileText className="w-4 h-4 text-gray-400 mr-2" />;
  };

  return (
    <div className="w-48 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
      <div className="px-4 py-3 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Project
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((filename) => (
          <button
            key={filename}
            onClick={() => onFileSelect(filename)}
            className={`w-full text-left px-4 py-1.5 flex items-center text-sm transition-colors ${
              activeFile === filename
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {getIcon(filename)}
            <span className="truncate">{filename}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
