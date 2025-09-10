# Vercel Build Fix Documentation

## Problem
Vercel build was failing with the error: "Could not resolve entry module 'index.html'." during the `vite build` process.

## Root Cause
The issue was caused by incompatible path resolution in `vite.config.ts`. The original configuration used `import.meta.dirname`, which may not be available or behave consistently in Vercel's Node.js build environment compared to local development environments.

## Solution
### 1. Updated `vite.config.ts`
- **Before**: Used `import.meta.dirname` for path resolution
- **After**: Use more robust cross-platform path resolution with `fileURLToPath` and `path.dirname`

```typescript
// OLD - potentially incompatible
const path = path.resolve(import.meta.dirname, "client");

// NEW - cross-platform compatible  
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "client");
```

### 2. Updated `vercel.json`
- Changed `installCommand` from `npm install` to `npm ci` for more reliable dependency installation
- Updated `buildCommand` to include `npm ci &&` to ensure dependencies are properly installed

## Files Changed
- `vite.config.ts` - Updated path resolution for cross-environment compatibility
- `vercel.json` - Improved build reliability with `npm ci`
- `verify-build.sh` - Added build verification script

## Local Verification
Run the build verification script to test locally:

```bash
./verify-build.sh
```

Or run the individual commands:

```bash
# Clean previous build
rm -rf dist/

# Install dependencies (as Vercel does)
npm ci

# Build the project
npm run build:client

# Verify output
ls -la dist/public/
```

## Expected Output Structure
```
dist/public/
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── images/
│   └── logo.jpg
└── index.html
```

## Vercel Deployment Process
1. Vercel runs: `npm ci` (install dependencies)
2. Vercel runs: `npm run build:client` (which executes `vite build`)
3. Vite loads `vite.config.ts` with the corrected path resolution
4. Vite finds `client/index.html` as the entry point
5. Build outputs to `dist/public/` as configured in `vercel.json`

## Testing the Fix
1. **Locally**: Run `./verify-build.sh` to ensure build works
2. **In Vercel**: Deploy to Vercel - the build should now complete successfully
3. **Verify deployment**: Check that the site loads and static assets are served correctly

## Key Configuration Details
- **Entry point**: `client/index.html`
- **Build output**: `dist/public/`
- **Vite root**: `client/` directory
- **Build command**: `npm run build:client` (runs `vite build`)
- **Path resolution**: Uses `__dirname` derived from `fileURLToPath(import.meta.url)` for Node.js compatibility