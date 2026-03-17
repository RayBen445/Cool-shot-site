"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Share2, Rocket, Cloud, CheckCircle, Code2, Monitor, TerminalSquare, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { EditorPanel } from "@/components/csslab/editor-panel";
import { PreviewPanel } from "@/components/csslab/preview-panel";
import { TerminalPanel } from "@/components/csslab/terminal-panel";
import { Sidebar } from "@/components/csslab/sidebar";
import { saveProject, updateProject, getTemplateById, getProjectById } from "@/lib/db";
import { supabase } from "@/lib/supabase";

type FileMap = Record<string, string>;

function LabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const projectId = searchParams.get("projectId");
  const templateId = searchParams.get("templateId");

  const [files, setFiles] = useState<FileMap>({});
  const [activeFile, setActiveFile] = useState<string>("index.html");
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "console" | "readme">("code");

  const [srcDoc, setSrcDoc] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  // Debounce save ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildPreview = useCallback((currentFiles = files) => {
    const html = currentFiles["index.html"] || "";
    const css = currentFiles["styles.css"] || "";
    const js = currentFiles["script.js"] || "";

    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
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

            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({
                type: 'csslab-console',
                log: 'Error: ' + msg + ' on line ' + line
              }, '*');
              return false;
            };

            window.addEventListener('unhandledrejection', function(event) {
              window.parent.postMessage({
                type: 'csslab-console',
                log: 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.toString() : 'Unknown error')
              }, '*');
            });
          </script>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch(e) {
              console.error(e);
            }
          <\/script>
        </body>
      </html>
    `;
    setSrcDoc(combined);
  }, [files]);

  useEffect(() => {
    const loadData = async () => {
      let initialFiles: FileMap = {
        "index.html": "<h1>Hello CSSLab</h1>\n<p>Start editing to see magic happen.</p>",
        "styles.css": "h1 {\n  color: #3b82f6;\n}\np {\n  color: #9ca3af;\n}",
        "script.js": "console.log('Welcome to CSSLab!');",
        "README.md": "# Untitled Project\n\nBuilt with CSSLab\n\n## Description\nNo description provided.\n\n## Technologies\nHTML, CSS, JavaScript"
      };

      try {
        if (projectId) {
          const p = await getProjectById(projectId);
          if (p) {
            if (p.files) {
              initialFiles = p.files as Record<string, string>;
            } else {
              // Migrate legacy data
              initialFiles = {
                "index.html": p.html_code || "",
                "styles.css": p.css_code || "",
                "script.js": p.js_code || "",
                "README.md": p.readme || "# Untitled Project\n\nBuilt with CSSLab\n\n## Description\nNo description provided."
              };
            }
          }
        } else if (templateId) {
          const t = await getTemplateById(templateId);
          if (t) {
            initialFiles = {
              "index.html": t.html || "",
              "styles.css": t.css || "",
              "script.js": t.js || "",
              "README.md": `# ${t.name}\n\n${t.description}\n\nBuilt with CSSLab template.`
            };
          }
        }
      } catch (err) {
        console.error("Error loading template/project:", err);
      }

      setFiles(initialFiles);
      if (!initialFiles[activeFile]) {
        setActiveFile("index.html");
      }
      buildPreview(initialFiles);
    };

    loadData();
  }, [projectId, templateId]); // only run when ID changes

  // Auto-save mechanism
  useEffect(() => {
    // Skip if not authenticated or no projectId
    if (!isAuthenticated || !projectId || Object.keys(files).length === 0) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateProject(projectId, {
          files,
          html_code: files["index.html"] || "",
          css_code: files["styles.css"] || "",
          js_code: files["script.js"] || "",
          readme: files["README.md"] || ""
        });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("idle");
      }
    }, 2000); // 2 seconds debounce

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [files, isAuthenticated, projectId]);

  // Listen for console logs from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'csslab-console') {
        setLogs(prev => [...prev, e.data.log]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleFileChange = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: content
    }));
  };

  const handleManualSavePreview = async () => {
    buildPreview(files);

    // Also trigger save
    if (isAuthenticated) {
      try {
        setSaveStatus("saving");
        let currentProjectId = projectId;

        const projectData = {
          html_code: files["index.html"] || "",
          css_code: files["styles.css"] || "",
          js_code: files["script.js"] || "",
          files: files,
          readme: files["README.md"] || ""
        };

        if (currentProjectId) {
          await updateProject(currentProjectId, projectData);
        } else {
          // If no project ID, get session and create
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
             const data = await saveProject({
               ...projectData,
               user_id: session.user.id
             });
             if (data && data.id) {
               currentProjectId = data.id;
               router.replace(`/lab?projectId=${data.id}`);
             }
          }
        }

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Save on build failed:", error);
        setSaveStatus("idle");
      }
    }
  };

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
        router.push("/auth/login?redirect=/lab");
        return;
      }

      // First ensure project is saved
      let currentProjectId = projectId;
      if (!currentProjectId) {
         const projectData = {
          html_code: files["index.html"] || "",
          css_code: files["styles.css"] || "",
          js_code: files["script.js"] || "",
          files: files,
          readme: files["README.md"] || ""
        };
        const data = await saveProject({
          ...projectData,
          user_id: session.user.id
        });
        if (data && data.id) {
          currentProjectId = data.id;
          router.replace(`/lab?projectId=${data.id}`);
        }
      }

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          html: files["index.html"],
          css: files["styles.css"],
          js: files["script.js"],
          projectId: currentProjectId
        })
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
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Log in to save and share projects.",
        });
        router.push("/auth/login?redirect=/lab");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let currentProjectId = projectId;

      if (!currentProjectId) {
         const projectData = {
          html_code: files["index.html"] || "",
          css_code: files["styles.css"] || "",
          js_code: files["script.js"] || "",
          files: files,
          readme: files["README.md"] || ""
        };
        const data = await saveProject({
          ...projectData,
          user_id: session.user.id
        });
        if (data && data.id) {
          currentProjectId = data.id;
        }
      } else {
        await updateProject(currentProjectId, {
          html_code: files["index.html"] || "",
          css_code: files["styles.css"] || "",
          js_code: files["script.js"] || "",
          files: files,
          readme: files["README.md"] || ""
        });
      }

      if (currentProjectId) {
        toast({
          title: "Project saved!",
          description: "Redirecting to your shareable link...",
        });
        router.push(`/p/${currentProjectId}`);
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

  const fileKeys = Object.keys(files);

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-white min-h-0 h-full">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <div className="text-gray-300 font-medium px-2 text-lg">CodingLab</div>

          {/* Save Status */}
          <div className="flex items-center text-xs ml-4">
            {saveStatus === "saving" && (
              <span className="flex items-center text-yellow-400">
                <Cloud className="w-3 h-3 mr-1 animate-pulse" />
                Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Top Tabs */}
          <div className="lg:hidden flex bg-gray-950 rounded-md overflow-hidden border border-gray-800 mr-2">
             <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 text-xs font-medium flex items-center ${activeTab === "code" ? "bg-gray-800 text-white" : "text-gray-400"}`}
              >
                <Code2 className="w-3 h-3 mr-1" /> Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 text-xs font-medium flex items-center ${activeTab === "preview" ? "bg-gray-800 text-white" : "text-gray-400"}`}
              >
                <Monitor className="w-3 h-3 mr-1" /> Preview
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`px-3 py-1.5 text-xs font-medium flex items-center ${activeTab === "console" ? "bg-gray-800 text-white" : "text-gray-400"}`}
              >
                <TerminalSquare className="w-3 h-3 mr-1" /> Console
              </button>
              <button
                onClick={() => setActiveTab("readme")}
                className={`px-3 py-1.5 text-xs font-medium flex items-center ${activeTab === "readme" ? "bg-gray-800 text-white" : "text-gray-400"}`}
              >
                <FileText className="w-3 h-3 mr-1" /> README
              </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSavePreview}
            className="bg-gray-800 text-green-400 border-gray-700 hover:bg-gray-700 hover:text-green-300 font-medium hidden sm:flex"
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
            <Rocket className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{isDeploying ? "Deploying..." : "Deploy"}</span>
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20"
          >
            <Share2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden w-full h-full relative">
        {/* Sidebar + Editor (Code View) */}
        <div className={`flex w-full lg:w-1/3 h-full overflow-hidden ${activeTab !== 'code' ? 'hidden lg:flex' : 'flex'}`}>
          <Sidebar
            files={fileKeys}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
          />
          <div className="flex-1 overflow-hidden h-full">
            <EditorPanel
              activeFile={activeFile}
              content={files[activeFile] || ""}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`w-full lg:w-1/3 h-full overflow-hidden border-x border-gray-800 ${activeTab !== 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          <PreviewPanel srcDoc={srcDoc} />
        </div>

        {/* Right column: Console and README */}
        <div className={`w-full lg:w-1/3 h-full flex flex-col overflow-hidden ${activeTab !== 'console' && activeTab !== 'readme' ? 'hidden lg:flex' : 'flex'}`}>

          {/* Top Tabs for Right Column (Desktop) */}
          <div className="hidden lg:flex bg-gray-900 border-b border-gray-800 text-sm">
            <button
              onClick={() => setActiveTab("console")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab !== "readme" ? "border-blue-500 text-white" : "border-transparent text-gray-400 hover:text-white"}`}
            >
              Console
            </button>
            <button
              onClick={() => setActiveTab("readme")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "readme" ? "border-blue-500 text-white" : "border-transparent text-gray-400 hover:text-white"}`}
            >
              README
            </button>
          </div>

          <div className="flex-1 overflow-hidden h-full relative">
            {/* Terminal View */}
            <div className={`absolute inset-0 ${activeTab !== 'readme' ? 'block' : 'hidden lg:block'} ${activeTab === 'readme' ? 'lg:hidden' : ''}`}>
              <TerminalPanel
                logs={logs}
                onClear={() => setLogs([])}
              />
            </div>

            {/* Readme View */}
            <div className={`absolute inset-0 bg-gray-950 p-6 overflow-auto border-t border-gray-800 lg:border-t-0 ${(activeTab === 'readme') ? 'block' : 'hidden'}`}>
              <div className="prose prose-invert max-w-none font-sans">
                 {/* Basic Markdown rendering fallback since we don't have a library confirmed */}
                 {files["README.md"]?.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-4 pb-2 border-b border-gray-800">{line.substring(2)}</h1>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                    if (line === '') return <br key={i} />;
                    return <p key={i} className="text-gray-300 mb-2">{line}</p>;
                 })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Lab() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading CSSLab...</div>}>
      <LabContent />
    </Suspense>
  )
}
