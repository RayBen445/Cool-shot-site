import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
    return;
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ 
        success: false, 
        error: 'Prompt is required and must be a string.' 
      });
      return;
    }

    // Get Gemini API key from environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    let imageUrl: string | null = null;
    let usedGemini = false;

    // Try Gemini first if API key is available
    if (geminiApiKey) {
      try {
        console.log('Attempting image generation with Google Gemini...');
        
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey
        });

        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
          },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
          const generatedImage = response.generatedImages[0];
          if (generatedImage.image && generatedImage.image.imageBytes) {
            // Convert base64 image bytes to data URL
            const base64Image = generatedImage.image.imageBytes;
            imageUrl = `data:image/png;base64,${base64Image}`;
            usedGemini = true;
            console.log('Successfully generated image with Google Gemini');
          }
        }
      } catch (geminiError) {
        console.warn('Gemini image generation failed, falling back to Gifted API:', geminiError);
      }
    }

    // Fall back to Gifted API if Gemini failed or API key not available
    if (!imageUrl) {
      try {
        console.log('Using Gifted API as fallback...');
        
        const giftedResponse = await fetch(
          `https://api.giftedtech.co.ke/api/ai/fluximg?apikey=gifted&prompt=${encodeURIComponent(prompt)}`
        );

        if (!giftedResponse.ok) {
          throw new Error(`Gifted API error: ${giftedResponse.status}`);
        }

        const giftedData = await giftedResponse.json();
        
        if (giftedData.success && giftedData.result) {
          imageUrl = giftedData.result;
          console.log('Successfully generated image with Gifted API');
        } else {
          throw new Error('Gifted API returned unsuccessful response');
        }
      } catch (giftedError) {
        console.error('Gifted API also failed:', giftedError);
        res.status(500).json({ 
          success: false, 
          error: 'Both Gemini and Gifted image generation services are currently unavailable. Please try again later.' 
        });
        return;
      }
    }

    if (!imageUrl) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate image using available services.' 
      });
      return;
    }

    // Return success response
    res.status(200).json({
      success: true,
      result: imageUrl,
      imageUrl: imageUrl,
      provider: usedGemini ? 'gemini' : 'gifted',
      message: `Image generated successfully using ${usedGemini ? 'Google Gemini' : 'Gifted API'}`
    });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error while processing image generation request.' 
    });
  }
}