"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Code2, Zap, Settings } from "lucide-react";

interface User {
  email?: string;
}

function AccountContent() {
  const [user, setUser] = useState<User | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentDeployments, setRecentDeployments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUser({ email: session.user.email });

        // Fetch recent projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!projectsError && projectsData) {
          setRecentProjects(projectsData);
        }

        // Fetch recent deployments
        const { data: deploymentsData, error: deploymentsError } = await supabase
          .from("deployments")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!deploymentsError && deploymentsData) {
          setRecentDeployments(deploymentsData);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load account data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading account...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Account</h1>
          <p className="text-gray-400">Manage your CSSLab account and projects</p>
        </div>

        {/* Account Info */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <Button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Projects</p>
                  <p className="text-2xl font-bold mt-1">{recentProjects.length}</p>
                </div>
                <Code2 className="w-10 h-10 text-blue-500/30" />
              </div>
              <Link href="/account/projects">
                <Button variant="ghost" className="w-full mt-4 text-blue-400 hover:text-blue-300 justify-start hover:bg-transparent">
                  View all projects →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Deployments</p>
                  <p className="text-2xl font-bold mt-1">{recentDeployments.length}</p>
                </div>
                <Zap className="w-10 h-10 text-purple-500/30" />
              </div>
              <Link href="/account/deployments">
                <Button variant="ghost" className="w-full mt-4 text-purple-400 hover:text-purple-300 justify-start hover:bg-transparent">
                  View all deployments →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Settings</p>
                  <p className="text-2xl font-bold mt-1">Configure</p>
                </div>
                <Settings className="w-10 h-10 text-cyan-500/30" />
              </div>
              <Link href="/account/settings">
                <Button variant="ghost" className="w-full mt-4 text-cyan-400 hover:text-cyan-300 justify-start hover:bg-transparent">
                  Go to settings →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <Link href="/account/projects">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Project {project.id.slice(0, 8)}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(project.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/lab?projectId=${project.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        Open
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Deployments */}
        {recentDeployments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Deployments</h2>
              <Link href="/account/deployments">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  See all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentDeployments.map((deployment) => (
                <Card key={deployment.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm truncate">{deployment.slug}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(deployment.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/deploy/${deployment.slug}`} target="_blank">
                      <Button variant="outline" className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white text-sm">
                        Visit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Account() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
