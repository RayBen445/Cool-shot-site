import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "AI Generator", href: "/ai-generator" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-lg sticky top-0 z-50 border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Cool Shot Systems Logo" 
                    className="h-10 w-auto object-contain"
                    data-testid="img-logo"
                  />
                  <h1 className="text-2xl font-bold text-white hidden sm:block">Cool Shot Systems</h1>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}>
                <span className={`transition-colors duration-200 cursor-pointer ${
                  location === item.href 
                    ? "text-white font-medium bg-white/20 px-3 py-1 rounded-lg" 
                    : "text-blue-100 hover:text-white hover:bg-white/10 px-3 py-1 rounded-lg"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
            <Link href="/contact" data-testid="button-get-started">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-lg font-semibold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 bg-gradient-to-b from-transparent to-blue-900/20">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase().replace(' ', '-')}`}>
                  <span
                    className={`block px-3 py-2 transition-colors duration-200 cursor-pointer rounded-lg mx-2 ${
                      location === item.href 
                        ? "text-white font-medium bg-white/20" 
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <Link href="/contact" data-testid="button-mobile-get-started">
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 mx-3 mt-2 shadow-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
