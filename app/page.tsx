"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, LayoutTemplate, Share2, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20 mb-4 text-sm font-medium">
            <Code2 className="w-4 h-4" />
            <span>Introducing CSSLab</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            The Web Engineering <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Playground
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Write HTML, CSS, and JavaScript with instant live previews.
            Experiment with templates, test your ideas, and share your code with the world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/lab" passHref legacyBehavior>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto shadow-lg shadow-blue-500/20">
                <Terminal className="mr-2 h-5 w-5" />
                Start Coding
              </Button>
            </Link>
            <Link href="/templates" passHref legacyBehavior>
              <Button variant="outline" size="lg" className="bg-gray-900 border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                <LayoutTemplate className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <Link href="/auth/login" passHref legacyBehavior>
              <Button variant="outline" size="lg" className="bg-transparent border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white px-8 py-6 h-auto text-lg w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" passHref legacyBehavior>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 h-auto text-lg w-full sm:w-auto shadow-lg shadow-purple-500/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-950 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to build web experiments</h2>
            <p className="text-gray-400 text-lg">A simple but powerful environment for web developers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardContent className="pt-8 px-6 pb-8 text-center sm:text-left">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                  <Terminal className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Preview</h3>
                <p className="text-gray-400 leading-relaxed">
                  See your changes instantly as you type. Our real-time editor updates the preview iframe automatically, letting you iterate quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardContent className="pt-8 px-6 pb-8 text-center sm:text-left">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                  <LayoutTemplate className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ready-to-use Templates</h3>
                <p className="text-gray-400 leading-relaxed">
                  Don't start from scratch. Choose from a variety of built-in templates covering basic HTML, CSS animations, and JS interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardContent className="pt-8 px-6 pb-8 text-center sm:text-left">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                  <Share2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Share Projects</h3>
                <p className="text-gray-400 leading-relaxed">
                  Built something cool? Save your project and get a unique, shareable link instantly so others can view and fork your code.
                </p>
              </CardContent>
            </Card>
                    </div>
        </div>
      </section>
    </div>
  );
}
