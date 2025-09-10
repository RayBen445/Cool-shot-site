#!/bin/bash

# Build Verification Script for Cool Shot Site
# This script verifies that the Vite build process works correctly
# Both locally and in deployment environments like Vercel

set -e

echo "🔧 Cool Shot Site - Build Verification Script"
echo "============================================="

# Check if we're in the right directory
if [[ ! -f "vite.config.ts" ]]; then
    echo "❌ Error: vite.config.ts not found. Please run this script from the project root."
    exit 1
fi

# Check if client/index.html exists
if [[ ! -f "client/index.html" ]]; then
    echo "❌ Error: client/index.html not found."
    exit 1
fi

echo "✅ Found required files:"
echo "   - vite.config.ts"
echo "   - client/index.html"

# Clean previous build
echo ""
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies (using npm ci for reproducible builds)
echo ""
echo "📦 Installing dependencies..."
npm ci

# Run the build
echo ""
echo "🏗️  Running build command..."
npm run build:client

# Verify build output
echo ""
echo "🔍 Verifying build output..."

if [[ ! -f "dist/public/index.html" ]]; then
    echo "❌ Build failed: dist/public/index.html not found"
    exit 1
fi

if [[ ! -d "dist/public/assets" ]]; then
    echo "❌ Build failed: dist/public/assets directory not found"
    exit 1
fi

# Check file sizes
INDEX_SIZE=$(wc -c < "dist/public/index.html")
ASSET_COUNT=$(find dist/public/assets -name "*.js" -o -name "*.css" | wc -l)

echo "✅ Build successful!"
echo "   - Output directory: dist/public/"
echo "   - Index.html size: ${INDEX_SIZE} bytes"
echo "   - Asset files: ${ASSET_COUNT} files"
echo "   - Build structure:"
find dist/public -type f | head -10 | sed 's/^/     /'

echo ""
echo "🎉 Build verification completed successfully!"
echo ""
echo "📋 Build Summary:"
echo "   - Build command: npm run build:client"
echo "   - Output directory: dist/public/"
echo "   - Entry point: client/index.html"
echo "   - Vite config: Uses explicit paths and entry point for robustness"
echo ""
echo "🚀 Ready for Vercel deployment!"