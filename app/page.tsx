"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Code2, ArrowRight, Zap, GitBranch, Rocket, Terminal } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="w-full h-screen bg-gray-950" />;
  }

  if (isAuthenticated) {
    return null; // Will redirect via navbar or component
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-gray-800 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span>CSSLab</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:text-white hover:border-gray-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full">
            <p className="text-blue-400 text-sm font-medium">Welcome to CSSLab</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Code. Preview. Deploy.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              All In One Place
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Write HTML, CSS, and JavaScript. See it render instantly. Deploy to a live URL. 
            Like GitHub meets Vercel, designed for developers who want to ship fast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                <Rocket className="w-5 h-5 mr-2" />
                Start Coding Now
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                Browse Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Demo Visual */}
          <div className="relative rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-3">
              <div className="h-2 bg-gray-800 rounded w-3/4" />
              <div className="h-2 bg-gray-800 rounded w-2/3" />
              <div className="h-2 bg-gray-800 rounded w-4/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Built for modern web development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors bg-gray-900/50">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Code Editor</h3>
              <p className="text-gray-400">
                Write HTML, CSS, and JavaScript with real-time syntax highlighting and instant preview updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors bg-gray-900/50">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Deployment</h3>
              <p className="text-gray-400">
                Deploy your projects with a single click. Get a live URL instantly and share with anyone in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors bg-gray-900/50">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Management</h3>
              <p className="text-gray-400">
                Organize, save, and manage all your projects. Fork templates, track deployments, and build faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">5000+</p>
              <p className="text-gray-400">Active Creators</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-400 mb-2">50K+</p>
              <p className="text-gray-400">Projects Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-cyan-400 mb-2">100%</p>
              <p className="text-gray-400">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-gray-800 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to build something great?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers creating and deploying web projects on CSSLab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/templates" className="hover:text-white transition">Templates</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Social</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-sm">
            <p>&copy; 2024 CSSLab. All rights reserved.</p>
            <p>Built by developers, for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
