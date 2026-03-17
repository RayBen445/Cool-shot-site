"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ArrowLeft, Mail } from "lucide-react";

interface User {
  email?: string;
  created_at?: string;
}

function SettingsContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUser({
          email: session.user.email,
          created_at: session.user.created_at,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
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
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/account">
            <button className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account settings</p>
        </div>

        {/* Account Information */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription className="text-gray-400">Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Email Address</label>
              <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                <span className="text-white">{user?.email}</span>
              </div>
            </div>
            {user?.created_at && (
              <div>
                <label className="text-sm text-gray-400 block mb-2">Member Since</label>
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 text-gray-300">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription className="text-gray-400">Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                To change your password, please use the password reset feature from the login page.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="mt-3 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card className="bg-gray-900 border-gray-800 border-red-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-red-400">Session</CardTitle>
            <CardDescription className="text-gray-400">Manage your active sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Sign out from this device</p>
            <Button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-gray-900/50 border-red-900/30">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-gray-400">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="outline"
              className="bg-red-900/20 border-red-900/50 hover:bg-red-900/30 text-red-400"
              disabled
            >
              Delete Account (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
