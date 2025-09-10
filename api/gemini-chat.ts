import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GeminiRequestBody {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

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
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        success: false, 
        error: 'Message is required and must be a string.' 
      });
      return;
    }

    // Get Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set');
      res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' 
      });
      return;
    }

    // Prepare the request body for Gemini API
    const requestBody: GeminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ]
    };

    // Make request to Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      res.status(geminiResponse.status).json({ 
        success: false, 
        error: `Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}` 
      });
      return;
    }

    const data: GeminiResponse = await geminiResponse.json();
    
    // Extract the response text from Gemini's response format
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      res.status(500).json({ 
        success: false, 
        error: 'No response text received from Gemini API' 
      });
      return;
    }

    // Return success response in format compatible with existing chat widget
    res.status(200).json({
      success: true,
      result: responseText,
      response: responseText, // Additional field for compatibility
      message: responseText   // Additional field for compatibility
    });

  } catch (error) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error while processing chat request.' 
    });
  }
}