# Vercel Deployment Guide

## Quick Setup

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure build settings:**
   Vercel should automatically detect the configuration from `vercel.json`, but verify these settings:
   - Framework Preset: `Other`
   - Build Command: `npm run build:client`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   In your Vercel project dashboard, add these environment variables:
   ```
   # Required for AI chat and image generation functionality
   GEMINI_API_KEY=your_google_gemini_api_key_here
   
   # Required for Telegram contact notifications (optional)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_CHAT_ID=your_telegram_chat_id_here
   ```

   **Note:** The AI features (chat & image generation) require a valid Google Gemini API key. Get one from [Google AI Studio](https://aistudio.google.com/). Image generation will fallback to Gifted API if Gemini is unavailable. The contact form will work without these variables, but Telegram notifications will be disabled.

4. **Deploy:**
   - Click "Deploy"
   - Your site will be live in minutes!

## Manual CLI Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? (accept default)
# - In which directory is your code located? ./

# For production deployment
vercel --prod
```

## Project Configuration

The project includes these Vercel-specific configurations:

### `vercel.json`
- Configures build process and routing
- Sets up API functions for serverless deployment
- Handles SPA routing with proper rewrites
- Includes CORS headers for API endpoints

### API Functions (`/api/`)
- `api/contact.ts` - Contact form endpoint
- `api/gemini-chat.ts` - AI chat using Google Gemini 2.0 Flash
- `api/generate-image.ts` - AI image generation (Gemini + Gifted fallback)
- Automatically deployed as serverless functions
- Uses TypeScript with `@vercel/node` runtime

### Build Process
- Frontend: Built with Vite to `dist/public`
- Backend: Serverless functions in `api/` directory
- Environment variables handled through Vercel dashboard

## Features Available on Vercel

✅ **Static Site Generation** - Fast loading React SPA  
✅ **Serverless API** - Contact form backend  
✅ **AI Chat Integration** - Google Gemini 2.0 Flash powered conversations  
✅ **AI Image Generation** - Gemini Imagen 4.0 with Gifted API fallback  
✅ **TypeScript Support** - Full type safety  
✅ **Environment Variables** - Secure config management  
✅ **Custom Domains** - Easy domain configuration  
✅ **HTTPS by Default** - Automatic SSL certificates  
✅ **Global CDN** - Optimized worldwide delivery  
✅ **Preview Deployments** - Branch-based previews  

## Troubleshooting

### Build Issues
- Ensure `npm run build:client` works locally
- Check that all dependencies are in `package.json`
- Verify TypeScript compiles without errors

### API Issues
- Check environment variables are set in Vercel dashboard
- Verify API function syntax in `api/` directory
- Check Vercel function logs for runtime errors

### Routing Issues
- Ensure `vercel.json` rewrites are configured correctly
- Check that SPA routing works with the rewrites

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/RayBen445/Cool-shot-site/issues)
- [Contact Developer](mailto:heritage@coolshotsystems.com)