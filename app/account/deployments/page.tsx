"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, ExternalLink, Trash2, Search, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { getDeploymentsByUser, deleteDeployment, DeploymentData } from "@/lib/db";
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
import { Badge } from "@/components/ui/badge";

export default function DeploymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeployments() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userDeployments = await getDeploymentsByUser(session.user.id);
          setDeployments(userDeployments);
        }
      } catch (err) {
        console.error("Error loading deployments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDeployments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDeployment(id);
      setDeployments(deployments.filter(d => d.id !== id));
      toast({
        title: "Deployment deleted",
        description: "Your deployment has been successfully removed. The URL is no longer active.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDeployments = deployments.filter(deployment =>
    deployment.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="text-gray-400 mt-1">Manage your live projects deployed on CSSLab.</p>
        </div>

        <Button onClick={() => router.push("/lab")} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto shadow-md shadow-purple-900/20">
          <Rocket className="mr-2 h-4 w-4" />
          Deploy New Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search deployments by URL slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {filteredDeployments.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-12 text-center">
          <Rocket className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300">
            {searchTerm ? "No matching deployments found" : "No deployments yet"}
          </h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
            {searchTerm
              ? `Try adjusting your search for "${searchTerm}" or deploy a new project.`
              : "You haven't deployed any projects yet. Deploy a project from the lab to see it live."}
          </p>
          <Button onClick={() => router.push("/lab")} className="bg-gray-800 hover:bg-gray-700">
            Open Lab
          </Button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950/50 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="py-3 px-4 font-medium">Deployment URL</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Deployed</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDeployments.map((deployment) => (
                  <tr key={deployment.id} className="hover:bg-gray-800/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <a
                          href={`https://${deployment.slug}.csslab.zone.id`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center"
                        >
                          {deployment.slug}.csslab.zone.id
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Active
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400">
                      {formatDistanceToNow(new Date(deployment.created_at || new Date()), { addSuffix: true })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {deployment.project_id && (
                          <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white" asChild>
                            <Link href={`/lab?projectId=${deployment.project_id}`}>
                              <Play className="h-4 w-4" />
                              <span className="sr-only">Open Lab</span>
                            </Link>
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-red-400 hover:bg-red-950/30">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center text-red-400">
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Delete Deployment
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete the deployment <span className="text-white font-mono">{deployment.slug}</span>? The deployed URL will no longer be accessible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white border-0">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(deployment.id!)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deletingId === deployment.id}
                              >
                                {deletingId === deployment.id ? "Deleting..." : "Yes, delete deployment"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
