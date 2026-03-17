"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Code2, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at: string;
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== deleteId));
      setDeleteId(null);
      toast({
        title: "Project deleted",
        description: "Your project has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/account">
              <button className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Account
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <p className="text-gray-400 mt-2">Manage all your saved projects</p>
          </div>
          <Link href="/lab">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Code2 className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-gray-400 text-center py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800 text-center py-12">
            <CardContent>
              <Code2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No projects yet</p>
              <p className="text-gray-500 mb-6">Start creating your first project in the Lab</p>
              <Link href="/lab">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Lab
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">Project {project.id.slice(0, 8)}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/lab?projectId=${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white">
                        Open
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(project.id)}
                      className="bg-red-900/20 border-red-900/50 hover:bg-red-900/30 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. The project will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Projects() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
