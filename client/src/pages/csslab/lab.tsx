import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Play, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

import { EditorPanel } from "@/components/csslab/editor-panel";
import { PreviewPanel } from "@/components/csslab/preview-panel";
import { TerminalPanel } from "@/components/csslab/terminal-panel";

export default function Lab() {
  const [html, setHtml] = useState("<h1>Hello CSSLab</h1>\n<p>Start editing to see magic happen.</p>");
  const [css, setCss] = useState("h1 {\n  color: #3b82f6;\n}\np {\n  color: #9ca3af;\n}");
  const [js, setJs] = useState("console.log('Welcome to CSSLab!');");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const buildPreview = useCallback((h = html, c = css, j = js) => {
    // Inject scripts to intercept console logs and errors
    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${c}</style>
          <script>
            // Intercept console.log, info, warn, error
            const methods = ['log', 'info', 'warn', 'error'];
            methods.forEach(method => {
              const original = console[method];
              console[method] = function(...args) {
                try {
                  const msg = args.map(arg => {
                    if (typeof arg === 'object') {
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }
                    return String(arg);
                  }).join(' ');

                  window.parent.postMessage({ type: 'csslab-console', log: msg }, '*');
                } catch(err) {
                  // Fallback
                }
                original.apply(console, args);
              };
            });

            // Intercept uncaught errors
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({
                type: 'csslab-console',
                log: 'Error: ' + msg + ' on line ' + line
              }, '*');
              return false;
            };

            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
              window.parent.postMessage({
                type: 'csslab-console',
                log: 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.toString() : 'Unknown error')
              }, '*');
            });
          </script>
        </head>
        <body>
          ${h}
          <script>
            try {
              ${j}
            } catch(e) {
              console.error(e);
            }
          <\/script>
        </body>
      </html>
    `;
    setSrcDoc(combined);
  }, [html, css, js]);

  useEffect(() => {
    // Initialize from template if navigating from /templates
    const savedCode = sessionStorage.getItem("csslab-template");
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode);
        setHtml(parsed.html || "");
        setCss(parsed.css || "");
        setJs(parsed.js || "");
        sessionStorage.removeItem("csslab-template"); // Clear after loading

        // Build right away if loaded from template
        buildPreview(parsed.html, parsed.css, parsed.js);
      } catch (e) {
        console.error("Failed to parse template code", e);
      }
    } else {
        // Initial build if no template is loaded
        buildPreview(html, css, js);
    }
  }, []);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Security: We accept '*' origin since it's a data url / srcdoc
      // Just check the payload shape
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
    <div className="flex-1 flex flex-col bg-gray-950 text-white min-h-0">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <div className="text-gray-300 font-medium px-2 text-lg">CodingLab</div>
          <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400 border border-gray-700">
            CSSLab | Built by Cool Shot Systems
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => buildPreview()}
            className="bg-gray-800 text-green-400 border-gray-700 hover:bg-gray-700 hover:text-green-300 font-medium"
          >
            <Play className="w-4 h-4 mr-2" />
            Build & Preview
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Project
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={45} minSize={20}>
            <EditorPanel
              html={html}
              css={css}
              js={js}
              onHtmlChange={setHtml}
              onCssChange={setCss}
              onJsChange={setJs}
            />
          </ResizablePanel>

          <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors w-1" />

          {/* Preview & Terminal Right Side */}
          <ResizablePanel defaultSize={55} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              {/* Preview Panel */}
              <ResizablePanel defaultSize={70} minSize={20}>
                <PreviewPanel srcDoc={srcDoc} />
              </ResizablePanel>

              <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors h-1" />

              {/* Terminal Panel */}
              <ResizablePanel defaultSize={30} minSize={10}>
                <TerminalPanel
                  logs={logs}
                  onClear={() => setLogs([])}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
