"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutTemplate, Play, GitFork } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTemplateById, saveProject, type TemplateData } from "@/lib/db";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TemplateViewer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForking, setIsForking] = useState(false);

  // Request Form State
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getTemplateById(id).then(data => {
        setTemplate(data);
      }).catch((e) => {
        console.error(e);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleOpenInLab = () => {
    if (template) {
      // Navigate to lab with templateId. Lab will fetch it.
      router.push(`/lab?templateId=${template.id}`);
    }
  };

  const handleFork = async () => {
    if (!template) return;
    setIsForking(true);
    try {
      const data = await saveProject({
        html_code: template.html || "",
        css_code: template.css || "",
        js_code: template.js || "",
        // user_id will be handled by Supabase auth implicitly via RLS or explicit JWT if added later.
      });
      if (data && data.id) {
        toast({
          title: "Template forked!",
          description: "Opening in Lab...",
        });
        router.push(`/lab?projectId=${data.id}`);
      }
    } catch (e) {
      toast({
        title: "Fork failed",
        description: "Could not create project from template.",
        variant: "destructive"
      });
    } finally {
      setIsForking(false);
    }
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;
    setIsRequesting(true);
    try {
      const { createTemplateRequest } = await import("@/lib/db");
      await createTemplateRequest({
        template_id: template.id,
        name: reqName,
        email: reqEmail,
        message: reqMsg
      });
      toast({
        title: "Request submitted!",
        description: "We will review your template request.",
      });
      setIsDialogOpen(false);
      setReqName("");
      setReqEmail("");
      setReqMsg("");
    } catch (e) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading template...</div>;
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Template Not Found</h1>
        <p className="text-gray-400">The template doesn't exist.</p>
        <Button onClick={() => router.push("/templates")}>Browse Templates</Button>
      </div>
    );
  }

  const srcDoc = `
    <html>
      <head>
        <style>${template.css}</style>
      </head>
      <body>
        ${template.html}
        <script>${template.js}</script>
      </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg mb-4">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
            <p className="text-gray-400">{template.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {template.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 text-sm text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-6 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" onClick={handleOpenInLab}>
              <Play className="w-4 h-4 mr-2" />
              Open in Lab
            </Button>

            <Button variant="outline" className="w-full bg-gray-900 border-gray-800 hover:bg-gray-800 text-white py-6" onClick={handleFork} disabled={isForking}>
              <GitFork className="w-4 h-4 mr-2" />
              {isForking ? "Forking..." : "Fork Template"}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-gray-900 py-6">
                  Request Customization
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-950 border border-gray-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Custom Template</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Need modifications to {template.name}? Send us a request.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitRequest} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input required value={reqName} onChange={e => setReqName(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input required type="email" value={reqEmail} onChange={e => setReqEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Description</label>
                    <textarea required value={reqMsg} onChange={e => setReqMsg(e.target.value)} rows={4} className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <Button type="submit" disabled={isRequesting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isRequesting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Right Column: Preview & Code Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Preview */}
          <div className="border border-gray-800 rounded-lg overflow-hidden bg-white shadow-xl h-96 relative">
            <div className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center justify-between z-10">
              <span>Live Preview</span>
            </div>
            <iframe
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-none pt-8"
              title="Template Preview"
            />
          </div>

          {/* Code Viewer */}
          <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-950">
            <Tabs defaultValue="html" className="w-full">
              <div className="bg-gray-900 border-b border-gray-800 px-2 py-1">
                <TabsList className="bg-transparent space-x-2">
                  <TabsTrigger value="html" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm">CSS</TabsTrigger>
                  <TabsTrigger value="js" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 font-mono text-sm">JS</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="html" className="m-0 p-4 font-mono text-sm text-blue-300 overflow-auto max-h-64 whitespace-pre">
                {template.html || "<!-- No HTML -->"}
              </TabsContent>
              <TabsContent value="css" className="m-0 p-4 font-mono text-sm text-purple-300 overflow-auto max-h-64 whitespace-pre">
                {template.css || "/* No CSS */"}
              </TabsContent>
              <TabsContent value="js" className="m-0 p-4 font-mono text-sm text-yellow-300 overflow-auto max-h-64 whitespace-pre">
                {template.js || "// No JavaScript"}
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
  );
}
