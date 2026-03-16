import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Lab() {
  const [html, setHtml] = useState("<h1>Hello CSSLab</h1>\n<p>Start editing to see magic happen.</p>");
  const [css, setCss] = useState("h1 {\n  color: #3b82f6;\n}\np {\n  color: #9ca3af;\n}");
  const [js, setJs] = useState("console.log('Welcome to CSSLab!');");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if there's any state passed via navigation
    const savedCode = sessionStorage.getItem("csslab-template");
    if (savedCode) {
      const parsed = JSON.parse(savedCode);
      setHtml(parsed.html || "");
      setCss(parsed.css || "");
      setJs(parsed.js || "");
      sessionStorage.removeItem("csslab-template"); // Clear it so it only runs once
    }
  }, []);

  const updatePreview = () => {
    const combined = `
      <html>
        <head>
          <style>${css}</style>
          <script>
            // Intercept console.log
            const originalLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'csslab-console', log: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'csslab-console', log: 'Error: ' + msg + ' on line ' + line }, '*');
              return false;
            };
          </script>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;
    setSrcDoc(combined);
  };

  // Debounce the update
  useEffect(() => {
    const timeout = setTimeout(updatePreview, 1000);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'csslab-console') {
        setLogs(prev => [...prev, e.data.log]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleShare = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, css, js }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Project saved!",
          description: "Redirecting to your shareable link...",
        });
        setLocation(`/p/${data.project.id}`);
      } else {
        throw new Error(data.message || "Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share project.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-64px-150px)] bg-gray-950 flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 p-2 flex justify-between items-center">
        <div className="text-gray-300 font-medium px-2">CSSLab Editor</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={updatePreview} className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white">
            <Play className="w-4 h-4 mr-2" />
            Build & Preview
          </Button>
          <Button size="sm" onClick={handleShare} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Project
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-gray-950 border-r border-gray-800">
            <Tabs defaultValue="html" className="flex-1 flex flex-col">
              <div className="bg-gray-900 border-b border-gray-800 px-2">
                <TabsList className="bg-transparent space-x-2 h-10">
                  <TabsTrigger value="html" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">CSS</TabsTrigger>
                  <TabsTrigger value="js" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">JS</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="html" className="flex-1 m-0">
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                />
              </TabsContent>
              <TabsContent value="css" className="flex-1 m-0">
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                />
              </TabsContent>
              <TabsContent value="js" className="flex-1 m-0">
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors w-1" />

        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="h-full bg-white relative">
                <iframe
                  title="preview"
                  srcDoc={srcDoc}
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full border-none"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors h-1" />

            <ResizablePanel defaultSize={30}>
              <div className="h-full bg-gray-900 flex flex-col">
                <div className="bg-gray-950 border-b border-gray-800 px-4 py-1.5 flex justify-between items-center text-xs text-gray-400">
                  <span>Console</span>
                  <button onClick={() => setLogs([])} className="hover:text-white">Clear</button>
                </div>
                <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                  {logs.map((log, i) => (
                    <div key={i} className="text-gray-300 border-b border-gray-800/50 pb-1 mb-1">{log}</div>
                  ))}
                  {logs.length === 0 && <div className="text-gray-600 italic">No output...</div>}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
