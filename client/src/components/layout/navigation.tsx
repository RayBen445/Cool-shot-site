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
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
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
                  <h1 className="text-2xl font-bold text-primary hidden sm:block">Cool Shot Systems</h1>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                <span className={`transition-colors duration-200 cursor-pointer ${
                  location === item.href 
                    ? "text-primary font-medium" 
                    : "text-gray-600 hover:text-primary"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
            <Link href="/contact" data-testid="button-get-started">
              <Button className="bg-primary text-white hover:bg-blue-700 transition-colors duration-200">
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
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase()}`}>
                  <span
                    className={`block px-3 py-2 transition-colors duration-200 cursor-pointer ${
                      location === item.href 
                        ? "text-primary font-medium" 
                        : "text-gray-600 hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <Link href="/contact" data-testid="button-mobile-get-started">
                <Button 
                  className="bg-primary text-white hover:bg-blue-700 transition-colors duration-200 mx-3 mt-2"
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
