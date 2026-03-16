"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
