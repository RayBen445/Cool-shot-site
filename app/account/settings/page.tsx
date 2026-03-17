"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and information.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your personal details linked to your CSSLab account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-950/50 border border-gray-800">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Email Address</p>
              <p className="text-lg font-medium text-white">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-950/50 border border-gray-800">
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Member Since</p>
              <p className="text-lg font-medium text-white">
                {user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-950/50 border border-gray-800">
            <div className="p-3 rounded-full bg-green-500/10 text-green-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Account Status</p>
              <p className="text-lg font-medium text-white flex items-center">
                Active <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-950/20 border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-lg flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription className="text-red-400/70">
            Log out from your current session on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
