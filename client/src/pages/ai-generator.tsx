import { useEffect } from "react";
import ImageGenerator from "@/components/ui/image-generator";

export default function AIGeneratorPage() {
  useEffect(() => {
    document.title = "AI Image Generator - Cool Shot Systems";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate stunning AI images with Cool Shot Systems advanced image generation technology. Transform your ideas into professional visuals instantly.');
    }
  }, []);

  return <ImageGenerator />;
}