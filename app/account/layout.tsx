"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, FolderRoot, Rocket, Settings, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login?redirect=/account");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && event === 'SIGNED_OUT') {
          router.push("/auth/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "Projects", href: "/account/projects", icon: FolderRoot },
    { name: "Deployments", href: "/account/deployments", icon: Rocket },
    { name: "Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cool Shot Systems
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Developer Dashboard</p>
        </div>

        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="text-sm truncate pr-2 text-gray-400">
              {user?.email}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
          <Link href="/" className="font-bold text-lg text-white">CSSLab</Link>
          <Button variant="outline" size="sm" onClick={() => router.push("/account")}>Menu</Button>
        </div>
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
