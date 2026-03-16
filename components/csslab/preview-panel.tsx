interface PreviewPanelProps {
  srcDoc: string;
}

export function PreviewPanel({ srcDoc }: PreviewPanelProps) {
  return (
    <div className="h-full bg-white relative">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex justify-between items-center text-xs text-gray-400 absolute top-0 left-0 right-0 z-10">
        <span>Preview Output</span>
      </div>
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className="w-full h-full border-none pt-8"
      />
    </div>
  );
}
