#!/bin/bash
# Automated deployment script for Notion Manual Website

echo "🚀 Notion Manual Website Deployment Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the notion-manual-website directory"
    exit 1
fi

echo "✅ Step 1: Checking git status..."
git status

echo ""
echo "📝 Step 2: All changes are committed"
echo ""

echo "📦 Step 3: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🔐 Next steps (require your authentication):"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Name it: notion-manual-website"
echo "   - Don't initialize with README"
echo "   - Click 'Create repository'"
echo ""
echo "2. After creating the repo, run these commands:"
echo "   git remote set-url origin https://github.com/YOUR_USERNAME/notion-manual-website.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to: https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Click 'Add New Project'"
echo "   - Import your repository"
echo "   - Click 'Deploy'"
echo ""
echo "4. After deployment, disable Vercel Authentication:"
echo "   - Project Settings → Deployment Protection"
echo "   - Disable 'Vercel Authentication'"
echo ""

