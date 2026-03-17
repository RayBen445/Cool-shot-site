"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, FolderRoot, Trash2, Edit2, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { getProjectsByUser, deleteProject, ProjectData } from "@/lib/db";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userProjects = await getProjectsByUser(session.user.id);
          setProjects(userProjects);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Project deleted",
        description: "Your project has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter(project =>
    (project.title || "Untitled Project").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-gray-400 mt-1">Manage all your CSSLab coding projects.</p>
        </div>

        <Button onClick={() => router.push("/lab")} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-12 text-center">
          <FolderRoot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300">
            {searchTerm ? "No matching projects found" : "No projects yet"}
          </h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
            {searchTerm
              ? `Try adjusting your search for "${searchTerm}" or create a new project.`
              : "You haven't created any projects yet. Start a new coding session to build something awesome!"}
          </p>
          <Button onClick={() => router.push("/lab")} className="bg-gray-800 hover:bg-gray-700">
            Create New Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group hover:border-gray-600 transition-colors flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {project.title || "Untitled Project"}
                  </h3>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-500 hover:text-white">
                        <span className="sr-only">Open menu</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.12132 8.625 12.5 8.625C11.87868 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.87868 6.375 12.5 6.375C13.12132 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem onClick={() => router.push(`/lab?projectId=${project.id}`)} className="cursor-pointer focus:bg-gray-800 focus:text-white">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-400 focus:text-red-300 focus:bg-red-950/30 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-red-400">
                              <AlertTriangle className="mr-2 h-5 w-5" />
                              Delete Project
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to delete "{project.title || "Untitled Project"}"? This action cannot be undone and will permanently remove all files associated with this project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white border-0">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id!)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={deletingId === project.id}
                            >
                              {deletingId === project.id ? "Deleting..." : "Yes, delete project"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {project.description || "No description provided."}
                </p>

                <div className="flex gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700">HTML</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700">CSS</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700">JS</span>
                </div>
              </div>

              <div className="bg-gray-950/50 border-t border-gray-800 p-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Updated {formatDistanceToNow(new Date(project.updated_at || project.created_at || new Date()), { addSuffix: true })}
                </span>
                <Button size="sm" variant="ghost" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30" asChild>
                  <Link href={`/lab?projectId=${project.id}`}>
                    <Play className="mr-2 h-3.5 w-3.5" />
                    Open Lab
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
