"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode2, LayoutTemplate } from "lucide-react";
import { listTemplates, type TemplateData } from "@/lib/db";

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const data = await listTemplates();
        setTemplates(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20 mb-4 text-sm font-medium">
            <LayoutTemplate className="w-4 h-4" />
            <span>Developer Marketplace</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Templates</h1>
          <p className="text-gray-400 text-lg">Kickstart your next project with a pre-built template.</p>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-12 flex justify-center items-center space-x-2">
             <span className="w-6 h-6 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></span>
             <span>Loading templates from database...</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-900 border border-gray-800 rounded-lg">
             <LayoutTemplate className="w-12 h-12 mx-auto text-gray-700 mb-4" />
             <p className="text-xl">No templates found.</p>
             <p className="text-sm mt-2">Add templates to Supabase to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-900 border-gray-800 text-white hover:border-blue-500/50 transition-colors duration-300 overflow-hidden flex flex-col">
                {template.preview_image ? (
                  <div className="h-40 w-full overflow-hidden border-b border-gray-800 relative bg-gray-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={template.preview_image} alt={template.name} className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gray-950 border-b border-gray-800 flex items-center justify-center relative">
                     <FileCode2 className="w-16 h-16 text-gray-800" />
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags?.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded border border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    onClick={() => router.push(`/templates/${template.id}`)}
                  >
                    View Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
