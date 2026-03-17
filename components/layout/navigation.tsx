"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    router.refresh();
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Lab", href: "/lab" },
    { name: "Templates", href: "/templates" },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Cool Shot Systems Logo" 
                    className="h-10 w-auto object-contain rounded-md"
                    data-testid="img-logo"
                  />
                  <h1 className="text-2xl font-bold text-white hidden sm:block tracking-tight"><span className="text-blue-500">CSS</span>Lab</h1>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}>
                <span className={`transition-colors duration-200 cursor-pointer ${
                  pathname === item.href
                    ? "text-white font-medium bg-gray-800 px-3 py-1 rounded-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1 rounded-lg"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700">
                    <User className="h-4 w-4 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-gray-800 focus:text-red-300 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4 ml-4 border-l border-gray-800 pl-4">
                <Link href="/auth/login">
                  <span className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                    Sign In
                  </span>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {!session && (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="h-8 bg-transparent border-gray-700 text-gray-300">
                  Login
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              className="hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 bg-gray-900 border-t border-gray-800 pt-2">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase().replace(' ', '-')}`}>
                  <span
                    className={`block px-3 py-2 transition-colors duration-200 cursor-pointer rounded-lg mx-2 ${
                      pathname === item.href
                        ? "text-white font-medium bg-gray-800"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}

              {session ? (
                <>
                  <div className="px-4 py-2 border-t border-gray-800 mt-2">
                    <p className="text-sm text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-5 py-2 text-left text-red-400 hover:bg-gray-800 rounded-lg mx-2 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="px-4 pt-4 pb-2 border-t border-gray-800 mt-2 space-y-3 flex flex-col">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent border-gray-700 text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
