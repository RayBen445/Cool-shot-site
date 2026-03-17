import { useEffect, useRef } from "react";

interface EditorPanelProps {
  activeFile: string;
  content: string;
  onChange: (val: string) => void;
}

export function EditorPanel({
  activeFile,
  content,
  onChange,
}: EditorPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeFile]);

  let placeholder = "<!-- Write your HTML here -->";
  if (activeFile.endsWith(".css")) placeholder = "/* Write your CSS here */";
  else if (activeFile.endsWith(".js")) placeholder = "// Write your JavaScript here";
  else if (activeFile.endsWith(".md")) placeholder = "# Markdown Content Here";

  return (
    <div className="h-full w-full flex flex-col bg-gray-950 overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-gray-400 font-mono text-sm">{activeFile}</span>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full flex-1 bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none overflow-auto"
        spellCheck="false"
        placeholder={placeholder}
      />
    </div>
  );
}
