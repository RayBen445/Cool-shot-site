# Cool Shot Systems - Full-Stack Web Application

## Overview

Cool Shot Systems is a modern business website built as a full-stack web application showcasing technology services and solutions. The application features a comprehensive marketing website with contact functionality, built using a React frontend with Express.js backend architecture. The site includes multiple pages (Home, About, Services, Portfolio, Contact) and implements a contact inquiry system for lead generation.

## Recent Changes (August 15, 2025)

### Background Music Integration
- Added floating audio player component with play/pause, volume controls, and mute functionality
- Integrated background music from user-provided audio file (https://files.catbox.moe/lnx9jf.mp3)
- Player positioned in bottom-right corner with professional styling
- Auto-play capability with browser permission handling
- Continuous loop functionality for seamless background audio

### Logo Integration  
- Added company logo (https://files.catbox.moe/4odb1o.jpg) to navigation header
- Integrated logo into footer alongside company name
- Updated favicon and Open Graph meta tags to use logo
- Responsive logo display (hidden text on mobile, visible on desktop)
- Enhanced SEO metadata with logo references

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing with file-based page structure
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system including CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and API data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Storage**: In-memory storage implementation with interface-based design for easy database migration
- **API Design**: RESTful endpoints for contact inquiry submission and retrieval
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Development**: Hot module replacement and request logging middleware

### Database Schema Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Schema**: Defined in shared directory for frontend/backend consistency
- **Tables**: Users table (id, username, password) and ContactInquiries table (id, firstName, lastName, email, company, service, message, createdAt)
- **Validation**: Zod schemas for runtime type checking and API validation

### Project Structure
- **Monorepo**: Shared types and schemas between frontend and backend
- **Client Directory**: React application with pages, components, hooks, and utilities
- **Server Directory**: Express application with routes, storage layer, and Vite integration
- **Shared Directory**: Common TypeScript types and Zod schemas

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle Kit**: Database migration and schema management tool

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development & Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Deployment & Hosting
- **Replit**: Development environment with integrated hosting and database provisioning
- **Cartographer Plugin**: Replit-specific development tooling for enhanced debugging