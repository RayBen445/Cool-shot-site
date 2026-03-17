interface PreviewPanelProps {
  srcDoc: string;
}

export function PreviewPanel({ srcDoc }: PreviewPanelProps) {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex justify-between items-center text-xs text-gray-400">
        <span>Preview Output</span>
      </div>
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className="flex-1 w-full h-full border-none"
      />
    </div>
  );
}
