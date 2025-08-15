import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(
        `https://api.giftedtech.co.ke/api/ai/fluximg?apikey=gifted&prompt=${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      // The API returns JSON with the image URL
      const data = await response.json();
      
      if (!data.success || !data.result) {
        throw new Error('Failed to generate image');
      }
      
      setGeneratedImage(data.result);

      toast({
        title: "Image Generated Successfully!",
        description: "Your AI-generated image is ready to view and download.",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate image. Please try again with a different prompt.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      try {
        // Fetch the image from the URL and create a blob for download
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-generated-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(url);
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the image. Please try right-clicking and saving the image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600 ml-3" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning visuals using advanced AI technology. 
            Describe your vision and watch it come to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-6 w-6" />
                <span>Create Your Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Describe your image
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="A handsome gentle man in a professional suit, corporate headshot, professional lighting, high quality..."
                  className="min-h-[120px] resize-none border-2 focus:border-blue-500 transition-colors"
                  disabled={isGenerating}
                  data-testid="textarea-image-prompt"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to generate or use the button below
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={generateImage}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg transition-all duration-200"
                  data-testid="button-generate-image"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate AI Image
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">High Quality</div>
                    <div>Professional results</div>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="font-semibold text-purple-600 dark:text-purple-400">Fast Generation</div>
                    <div>Results in seconds</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-semibold text-green-600 dark:text-green-400">AI Powered</div>
                    <div>Latest technology</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-6 w-6" />
                  <span>Generated Result</span>
                </div>
                {generatedImage && (
                  <Button
                    onClick={downloadImage}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    data-testid="button-download-image"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">Creating your image...</p>
                      <p className="text-sm text-gray-500">This may take a few moments</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="AI Generated"
                    className="w-full h-full object-cover rounded-lg shadow-inner"
                    data-testid="img-generated-result"
                  />
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400">No image generated yet</p>
                      <p className="text-sm text-gray-500">Enter a prompt and click generate to create an AI image</p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Image generated successfully! Right-click to save or use the download button.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts Section */}
        <Card className="mt-8 max-w-4xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <span>Example Prompts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "A professional business headshot of a confident person in a modern office",
                "Abstract digital art with vibrant colors and geometric patterns",
                "A serene landscape with mountains and a peaceful lake at sunset",
                "Modern minimalist logo design for a technology company",
                "Futuristic cityscape with neon lights and flying cars",
                "Portrait of a wise elderly person with kind eyes and gentle smile"
              ].map((example, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  onClick={() => setPrompt(example)}
                  data-testid={`example-prompt-${index}`}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{example}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Click any example above to use it as your prompt
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}