import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EditorPanelProps {
  html: string;
  css: string;
  js: string;
  onHtmlChange: (val: string) => void;
  onCssChange: (val: string) => void;
  onJsChange: (val: string) => void;
}

export function EditorPanel({
  html,
  css,
  js,
  onHtmlChange,
  onCssChange,
  onJsChange,
}: EditorPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-950 border-r border-gray-800">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-800 px-2">
          <TabsList className="bg-transparent space-x-2 h-10">
            <TabsTrigger
              value="html"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm px-4 py-1.5"
            >
              HTML
            </TabsTrigger>
            <TabsTrigger
              value="css"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm px-4 py-1.5"
            >
              CSS
            </TabsTrigger>
            <TabsTrigger
              value="js"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm px-4 py-1.5"
            >
              JS
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="html" className="flex-1 m-0">
          <textarea
            value={html}
            onChange={(e) => onHtmlChange(e.target.value)}
            className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
            placeholder="<!-- Write your HTML here -->"
          />
        </TabsContent>
        <TabsContent value="css" className="flex-1 m-0">
          <textarea
            value={css}
            onChange={(e) => onCssChange(e.target.value)}
            className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
            placeholder="/* Write your CSS here */"
          />
        </TabsContent>
        <TabsContent value="js" className="flex-1 m-0">
          <textarea
            value={js}
            onChange={(e) => onJsChange(e.target.value)}
            className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
            placeholder="// Write your JavaScript here"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
