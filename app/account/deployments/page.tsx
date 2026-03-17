"use client";

import { useEffect, useState } from "react";
import { getDeploymentsByUser, deleteDeployment, type DeploymentData } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export default function DeploymentsDashboard() {
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadUserAndDeployments() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // For development/testing without strict auth, we might not have a session.
        // If there's no session, we can't reliably fetch deployments with RLS.
        if (session?.user?.id) {
          setUserId(session.user.id);
          const data = await getDeploymentsByUser(session.user.id);
          setDeployments(data);
        } else {
          // Fallback or handle unauthenticated state
          setUserId(null);
        }
      } catch (error) {
        console.error("Failed to load deployments:", error);
        toast({
          title: "Error",
          description: "Failed to load deployments.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserAndDeployments();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDeployment(id);
      setDeployments((prev) => prev.filter((dep) => dep.id !== id));
      toast({
        title: "Deployment Deleted",
        description: "Your deployment has been removed successfully.",
      });
    } catch (error) {
      console.error("Failed to delete deployment:", error);
      toast({
        title: "Error",
        description: "Could not delete the deployment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground">Please log in to view your deployments.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground">Manage your deployed CSSLab projects here.</p>
      </div>

      {deployments.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-card text-card-foreground shadow-sm">
          <p className="text-muted-foreground">You don't have any deployments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
              <div className="space-y-1">
                <a
                  href={`https://${deployment.slug}.csslab.zone.id`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline flex items-center gap-2 text-blue-500"
                >
                  {deployment.slug}.csslab.zone.id
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-muted-foreground">
                  Created {deployment.created_at ? format(new Date(deployment.created_at), 'PPP') : 'Unknown'}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deployment.id && handleDelete(deployment.id)}
                title="Delete deployment"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
