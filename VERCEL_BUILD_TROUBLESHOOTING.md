# Vercel Build Troubleshooting Guide

## Issue: "Could not resolve entry module 'index.html'" Error

### Problem Description
This error occurs when Vite cannot locate the `index.html` file during the build process on Vercel. While the build may work locally, differences in Vercel's environment can cause path resolution issues.

### Root Causes
1. **Path Resolution Differences**: Local environment vs. Vercel environment may handle path resolution differently
2. **Working Directory**: Vercel may run commands from a different working directory than expected
3. **File System Access**: Different file system permissions or structure in Vercel's build environment

### Solution Implemented

#### 1. Enhanced `vite.config.ts` Configuration
```typescript
// Explicit path resolution
const rootDir = path.resolve(__dirname);
const clientDir = path.join(rootDir, "client");
const indexHtml = path.join(clientDir, "index.html");

// File existence verification
if (!existsSync(clientDir)) {
  throw new Error(`Client directory not found: ${clientDir}`);
}
if (!existsSync(indexHtml)) {
  throw new Error(`Index.html not found: ${indexHtml}`);
}

// Explicit entry point configuration
build: {
  rollupOptions: {
    input: path.resolve(clientDir, "index.html"),
  },
},
```

#### 2. Key Improvements
- **Explicit Entry Point**: Tells Vite exactly where to find the index.html file
- **Path Validation**: Checks that required files exist before starting the build
- **Cross-Platform Paths**: Uses `path.join()` for reliable cross-platform path handling
- **Early Error Detection**: Fails fast with clear error messages if files are missing

### Verification Steps

#### Local Verification
```bash
# Use the verification script
./verify-build.sh

# Or manual verification
npm ci
npm run build:client
ls -la dist/public/  # Should show index.html and assets/
```

#### Vercel Build Logs
Look for these indicators in Vercel build logs:
- ✅ **Success**: "✓ built in X.XXs" message
- ❌ **Failure**: "Could not resolve entry module" error
- 🔍 **Debug**: Check if the config file is found: "bundled config file loaded"

### Configuration Files

#### `vercel.json` (Current Configuration)
```json
{
  "buildCommand": "npm ci && npm run build:client",
  "outputDirectory": "dist/public"
}
```

#### `package.json` Build Script
```json
{
  "scripts": {
    "build:client": "vite build"
  }
}
```

### Troubleshooting Checklist

If the build still fails on Vercel:

1. **Check File Structure**:
   - [ ] `client/index.html` exists
   - [ ] `vite.config.ts` is in the root directory
   - [ ] `package.json` contains the correct build script

2. **Verify Paths**:
   - [ ] All paths in `vite.config.ts` are absolute
   - [ ] Entry point explicitly set in `rollupOptions.input`

3. **Check Vercel Environment**:
   - [ ] Node.js version compatibility
   - [ ] Build command runs from correct directory
   - [ ] No case sensitivity issues (Linux vs. Windows)

4. **Alternative Solutions** (if needed):
   ```json
   // Alternative vercel.json with explicit directory
   {
     "buildCommand": "npm ci && cd client && npx vite build --config ../vite.config.ts",
     "outputDirectory": "dist/public"
   }
   ```

### Common Error Patterns

1. **"index.html not found"**:
   - Check file exists in `client/` directory
   - Verify case sensitivity (index.html vs Index.html)

2. **"vite command not found"**:
   - Ensure `npm ci` installs dependencies
   - Check if Vite is in devDependencies

3. **"Cannot resolve module"**:
   - Verify all imported modules exist
   - Check path aliases in Vite config

### Success Indicators

A successful build should show:
```
✓ 1833 modules transformed.
✓ built in X.XXs
dist/public/index.html                   X.XX kB
dist/public/assets/index-XXXXXXXX.css    XX.XX kB  
dist/public/assets/index-XXXXXXXX.js     XXX.XX kB
```

### Getting Help

If the issue persists:
1. Check Vercel build logs for specific error messages
2. Compare local vs. Vercel Node.js versions
3. Test with `NODE_ENV=production npm run build:client` locally
4. Consider creating a minimal reproduction case