# Cool Shot Systems - Full-Stack Web Application

A modern, responsive website built with React, TypeScript, and Express.js, designed for deployment on Vercel.

## Overview

Cool Shot Systems is a full-stack web application featuring:
- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Vite
- **Backend**: Express.js API with serverless functions
- **Database**: Neon PostgreSQL (configurable)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Features

- 🎯 Modern, responsive design
- 📱 Mobile-first approach
- ⚡ Fast loading with Vite
- 🔒 Type-safe with TypeScript
- 📧 Contact form with Telegram notifications
- 🤖 AI-powered chat using Google Gemini 2.0 Flash
- 🎨 AI image generation with Google Gemini Imagen 4.0 (Gifted API fallback)
- 🎨 Beautiful UI with Radix components
- 🌙 Theme support
- 📊 Analytics integration ready

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RayBen445/Cool-shot-site)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Clone and Install**
   ```bash
   git clone https://github.com/RayBen445/Cool-shot-site.git
   cd Cool-shot-site
   npm install
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - What's your project's name? (accept default or customize)
   - In which directory is your code located? `./`

### Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
# AI Chat & Image Generation (recommended for full AI features)
GEMINI_API_KEY=your_google_gemini_api_key

# Telegram Bot Notifications (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Database (optional - uses in-memory storage by default)
DATABASE_URL=your_neon_database_url
```

**Getting Your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key and add it to your Vercel environment variables

**Note on AI Services:**
- **Chat functionality**: Uses Google Gemini 2.0 Flash model for intelligent conversations
- **Image generation**: Prioritizes Google Gemini's Imagen 4.0 with Gifted API as fallback for reliability
- If `GEMINI_API_KEY` is not set, chat will not work and image generation will use Gifted API only

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   This starts both the frontend and backend in development mode with hot reloading.

3. **Open Browser**
   ```
   http://localhost:5000
   ```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build both frontend and backend
- `npm run build:client` - Build only frontend (used by Vercel)
- `npm run start` - Start production server locally
- `npm run check` - TypeScript type checking

## Project Structure

```
Cool-shot-site/
├── api/                    # Vercel serverless functions
│   ├── contact.ts         # Contact form API endpoint
│   ├── gemini-chat.ts     # AI chat using Google Gemini
│   └── generate-image.ts  # AI image generation (Gemini + Gifted fallback)
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Application pages/routes
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
│   └── index.html        # HTML template
├── server/                # Express backend (for local dev)
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage layer
│   └── email.ts          # Notification service
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas and types
├── vercel.json          # Vercel deployment configuration
└── vite.config.ts       # Vite build configuration
```

## API Endpoints

### POST /api/contact
Submit a contact form inquiry.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "company": "string (optional)",
  "service": "string (optional)",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "inquiry": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "company": "string",
    "service": "string", 
    "message": "string",
    "createdAt": "date"
  }
}
```

### GET /api/contact
Retrieve all contact inquiries (admin endpoint).

### POST /api/gemini-chat
Send a message to the AI chat assistant powered by Google Gemini.

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "result": "string (AI response)",
  "response": "string (AI response)",
  "message": "string (AI response)"
}
```

### POST /api/generate-image  
Generate AI images using Google Gemini with Gifted API as fallback.

**Request Body:**
```json
{
  "prompt": "string (image description)"
}
```

**Response:**
```json
{
  "success": true,
  "result": "string (image URL or data URL)",
  "imageUrl": "string (image URL or data URL)",
  "provider": "gemini | gifted",
  "message": "string (success message)"
}
```

**Environment Variables:**
- `GEMINI_API_KEY` - Your Google Gemini API key (recommended for both chat and image generation)
- Image generation will fallback to Gifted API if Gemini is unavailable

## Technologies

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **React Hook Form** - Performant forms with validation
- **Zod** - Runtime type validation
- **Lucide React** - Beautiful icons
- **Wouter** - Minimalist routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety across the stack
- **Vercel Functions** - Serverless API endpoints
- **Zod** - Request validation

### Database (Optional)
- **Neon PostgreSQL** - Serverless PostgreSQL
- **Drizzle ORM** - Type-safe database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For technical support or questions, please contact:
- **Email**: heritage@coolshotsystems.com
- **GitHub**: [@RayBen445](https://github.com/RayBen445)

---

© 2024 Cool Shot Systems. All rights reserved.
---

## Production Setup & Database Integration (Supabase)

CSSLab uses Supabase as its primary database.

### 1. Database Migrations
Before deploying or running locally with the database, apply the schema located in `db/schema.sql` to your Supabase project using the Supabase Dashboard's SQL Editor. This will create the required `projects`, `templates`, and `template_requests` tables with Row Level Security (RLS) policies configured for secure client-side access.

### 2. Environment Variables
Add the following environment variables to your local `.env` file and your Vercel deployment settings:

```env
# Supabase Configuration
# For Next.js projects, use NEXT_PUBLIC_...
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# For Vite projects, use VITE_...
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Security Note:** Only expose the public `anon` key to the client. Never expose the Supabase Service Role Key. Client-side database actions are securely restricted using Row Level Security (RLS).

### 3. Vercel Deployment
The repository includes a `vercel.json` file properly configured with:
- Dynamic SPA rewrites handling client-side routing like `/p/[id]`.
- Vercel Edge Runtime for any defined API functions (`api/**/*.ts`).
- Standard web security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

To deploy:
1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, add the required Environment Variables.
3. Deploy! Vercel will automatically use the `vercel.json` configuration to build the client and set up serverless routes.
