"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Share2, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { EditorPanel } from "@/components/csslab/editor-panel";
import { PreviewPanel } from "@/components/csslab/preview-panel";
import { TerminalPanel } from "@/components/csslab/terminal-panel";
import { saveProject, getTemplateById, getProjectById } from "@/lib/db";
import { supabase } from "@/lib/supabase";

function LabContent() {
  const [html, setHtml] = useState("<h1>Hello CSSLab</h1>\n<p>Start editing to see magic happen.</p>");
  const [css, setCss] = useState("h1 {\n  color: #3b82f6;\n}\np {\n  color: #9ca3af;\n}");
  const [js, setJs] = useState("console.log('Welcome to CSSLab!');");
  const [srcDoc, setSrcDoc] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    const templateId = searchParams.get("templateId");
    const projectId = searchParams.get("projectId");

    const loadData = async () => {
      try {
        if (templateId) {
          const t = await getTemplateById(templateId);
          if (t) {
            setHtml(t.html || "");
            setCss(t.css || "");
            setJs(t.js || "");
            buildPreview(t.html, t.css, t.js);
            return;
          }
        } else if (projectId) {
          const p = await getProjectById(projectId);
          if (p) {
            setHtml(p.html_code || "");
            setCss(p.css_code || "");
            setJs(p.js_code || "");
            buildPreview(p.html_code, p.css_code, p.js_code);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading template/project:", err);
      }

      // Fallback
      buildPreview(html, css, js);
    };

    loadData();
  }, [searchParams]);

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


  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to deploy projects.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ html, css, js })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Deployment failed');
      }

      const result = await response.json();

      toast({
        title: "Deployment Successful! 🚀",
        description: (
          <div className="mt-2 flex flex-col space-y-2">
            <p>Your project is live at:</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium break-all"
            >
              {result.url}
            </a>
          </div>
        ),
      });
    } catch (error: any) {
      toast({
        title: "Deployment Error",
        description: error.message || "Failed to deploy project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleShare = async () => {
    try {
      const data = await saveProject({ html_code: html, css_code: css, js_code: js });
      if (data && data.id) {
        toast({
          title: "Project saved!",
          description: "Redirecting to your shareable link...",
        });
        router.push(`/p/${data.id}`);
      } else {
        throw new Error("Failed to save");
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
    <div className="flex-1 flex flex-col bg-gray-950 text-white min-h-0 h-full">
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
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/20"
          >
            <Rocket className="w-4 h-4 mr-2" />
            {isDeploying ? "Deploying..." : "Deploy"}
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
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden w-full h-full">
        {/* Editor Panel */}
        <div className="w-full lg:w-1/3 h-1/3 lg:h-full flex flex-col overflow-hidden">
          <EditorPanel
            html={html}
            css={css}
            js={js}
            onHtmlChange={setHtml}
            onCssChange={setCss}
            onJsChange={setJs}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-full lg:w-1/3 h-1/3 lg:h-full flex flex-col overflow-hidden border-y lg:border-y-0 lg:border-x border-gray-800">
          <PreviewPanel srcDoc={srcDoc} />
        </div>

        {/* Terminal Panel */}
        <div className="w-full lg:w-1/3 h-1/3 lg:h-full flex flex-col overflow-hidden">
          <TerminalPanel
            logs={logs}
            onClear={() => setLogs([])}
          />
        </div>
      </div>
    </div>
  );
}

export default function Lab() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading CodingLab...</div>}>
      <LabContent />
    </Suspense>
  )
}
