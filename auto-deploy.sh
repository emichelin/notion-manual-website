#!/bin/bash
set -e

echo "🚀 Automated Deployment Script"
echo "================================"
echo ""

cd ~/notion-manual-website

# Step 1: Check GitHub authentication
echo "📋 Step 1: Checking GitHub authentication..."
if ! gh auth status &>/dev/null; then
    echo "⚠️  Not authenticated with GitHub. Starting authentication..."
    echo "   A browser window will open. Please complete the authentication."
    gh auth login --web
    echo "✅ GitHub authentication complete!"
else
    echo "✅ Already authenticated with GitHub"
fi

# Step 2: Create GitHub repository
echo ""
echo "📋 Step 2: Creating GitHub repository..."
REPO_NAME="notion-manual-website"
if gh repo view "$REPO_NAME" &>/dev/null; then
    echo "⚠️  Repository $REPO_NAME already exists. Using existing repo."
else
    echo "   Creating repository: $REPO_NAME"
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo "✅ Repository created and code pushed!"
fi

# Step 3: Check Vercel authentication
echo ""
echo "📋 Step 3: Checking Vercel authentication..."
if ! vercel whoami &>/dev/null; then
    echo "⚠️  Not authenticated with Vercel. Starting authentication..."
    echo "   A browser window will open. Please complete the authentication."
    vercel login
    echo "✅ Vercel authentication complete!"
else
    echo "✅ Already authenticated with Vercel"
    vercel whoami
fi

# Step 4: Deploy to Vercel
echo ""
echo "📋 Step 4: Deploying to Vercel..."
echo "   This may take a few minutes..."
vercel --yes --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: After deployment, go to Vercel dashboard:"
echo "   Settings → Deployment Protection → Disable 'Vercel Authentication'"
echo "   (This is required for social preview images to work)"
echo ""

