"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthenticatedNavbar } from "./navbar-auth";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="w-full h-screen bg-gray-950" />;
  }

  return (
    <>
      {isAuthenticated && <AuthenticatedNavbar />}
      {children}
    </>
  );
}
