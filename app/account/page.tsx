"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ExternalLink, ArrowRight, FolderRoot, Rocket, Code2, CopyPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { getProjectsByUser, getDeploymentsByUser, ProjectData, DeploymentData } from "@/lib/db";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const userId = session.user.id;

          const userProjects = await getProjectsByUser(userId);
          setProjects(userProjects.slice(0, 3)); // Only recent 3

          const userDeployments = await getDeploymentsByUser(userId);
          setDeployments(userDeployments.slice(0, 3)); // Only recent 3
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCreateProject = () => {
    router.push("/lab");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, {user?.email?.split('@')[0] || 'Developer'}! Here's an overview of your workspace.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
            <Link href="/templates">
              <CopyPlus className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
            <FolderRoot className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Deployments</CardTitle>
            <Rocket className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Templates</CardTitle>
            <Code2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link href="/account/projects" className="text-sm text-blue-400 hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <FolderRoot className="h-8 w-8 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-300">No projects yet</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Create your first project to get started.</p>
              <Button onClick={handleCreateProject} variant="outline" size="sm" className="border-gray-700">
                Create Project
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/lab?projectId=${project.id}`}>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                          {project.title || "Untitled Project"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated {formatDistanceToNow(new Date(project.updated_at || project.created_at || new Date()), { addSuffix: true })}
                        </p>
                      </div>
                      <Code2 className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deployments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Deployments</h2>
            <Link href="/account/deployments" className="text-sm text-blue-400 hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {deployments.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <Rocket className="h-8 w-8 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-300">No deployments yet</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Deploy a project to share it with the world.</p>
              <Button asChild variant="outline" size="sm" className="border-gray-700">
                <Link href="/lab">Open Lab</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-200 flex items-center">
                        <a
                          href={`https://${deployment.slug}.csslab.zone.id`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors flex items-center"
                        >
                          {deployment.slug}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Deployed {formatDistanceToNow(new Date(deployment.created_at || new Date()), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
