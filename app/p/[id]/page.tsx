"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Copy, Check, GitFork } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProjectById } from "@/lib/db";

export default function ProjectViewer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      getProjectById(id).then(data => {
        if (data) {
          setHtml(data.html_code || "");
          setCss(data.css_code || "");
          setJs(data.js_code || "");
        } else {
            setError(true);
        }
        setIsLoading(false);
      }).catch(() => {
          setError(true);
          setIsLoading(false);
      })
    }
  }, [id]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied!",
      description: "You can now share this project with others.",
    });
  };

  const handleFork = () => {
    sessionStorage.setItem("csslab-template", JSON.stringify({ html, css, js }));
    router.push("/lab");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading project...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="text-gray-400">The project you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-white min-h-0">
      <div className="bg-gray-900 border-b border-gray-800 p-2 flex justify-between items-center shrink-0">
        <div className="text-gray-300 font-medium px-2 flex items-center space-x-2">
          <span>Project Viewer</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">Read-only mode</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white">
            {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy Link
          </Button>
          <Button size="sm" onClick={handleFork} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20">
            <GitFork className="w-4 h-4 mr-2" />
            Fork to Lab
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={45} minSize={30}>
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
                    readOnly
                    className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none cursor-default"
                    spellCheck="false"
                  />
                </TabsContent>
                <TabsContent value="css" className="flex-1 m-0">
                  <textarea
                    value={css}
                    readOnly
                    className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none cursor-default"
                    spellCheck="false"
                  />
                </TabsContent>
                <TabsContent value="js" className="flex-1 m-0">
                  <textarea
                    value={js}
                    readOnly
                    className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none cursor-default"
                    spellCheck="false"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors w-1" />

          <ResizablePanel defaultSize={55} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={20}>
                <div className="h-full bg-white relative">
                  <iframe
                    title="preview"
                    srcDoc={srcDoc}
                    sandbox="allow-scripts allow-modals"
                    className="w-full h-full border-none pointer-events-auto"
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-gray-800 hover:bg-blue-500 transition-colors h-1" />

              <ResizablePanel defaultSize={30} minSize={10}>
                <div className="h-full bg-gray-900 flex flex-col">
                  <div className="bg-gray-950 border-b border-gray-800 px-4 py-1.5 flex justify-between items-center text-xs text-gray-400 shrink-0">
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
    </div>
  );
}
