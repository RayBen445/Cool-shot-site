"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isUserAdmin } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X, Bell, Settings, LogOut, LayoutGrid, FolderOpen } from "lucide-react";

export function AuthenticatedNavbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user?.email) {
        const admin = await isUserAdmin(user.email);
        setIsAdmin(admin);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/account" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white hidden sm:inline">CSSLab</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/account" className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded transition">
              Dashboard
            </Link>
            <Link href="/account/projects" className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded transition flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </Link>
            <Link href="/lab" className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded transition">
              Editor
            </Link>
            <Link href="/templates" className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded transition">
              Templates
            </Link>
            {isAdmin && (
              <Link href="/admin" className="px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded transition font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-white rounded hover:bg-gray-900 transition">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <Link href="/account/settings">
              <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-gray-900 transition">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 rounded hover:bg-red-900/20 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded hover:bg-gray-900"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/account" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded">
              Dashboard
            </Link>
            <Link href="/account/projects" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded">
              Projects
            </Link>
            <Link href="/lab" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded">
              Editor
            </Link>
            <Link href="/templates" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded">
              Templates
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded font-medium">
                Admin
              </Link>
            )}
            <hr className="border-gray-800 my-2" />
            <Link href="/account/settings" className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded">
              Settings
            </Link>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
