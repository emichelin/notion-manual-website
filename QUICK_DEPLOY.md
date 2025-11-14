# Quick Deploy Guide - No CLI Needed!

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `notion-manual-website` (or any name you like)
3. Make it **Public** or **Private** (your choice)
4. **Don't** check "Initialize with README"
5. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
cd ~/notion-manual-website

# Change remote to YOUR new repository
# Replace YOUR_USERNAME with your GitHub username
git remote set-url origin https://github.com/YOUR_USERNAME/notion-manual-website.git

# Push your code
git push -u origin main
```

You'll be asked for your GitHub username and password (or use a personal access token).

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up or log in (use GitHub to sign in - it's easiest!)
3. Click **"Add New Project"**
4. Click **"Import"** next to your `notion-manual-website` repository
5. Vercel will auto-detect Next.js settings - just click **"Deploy"**
6. Wait 2-3 minutes
7. Your site will be live! 🎉

## Step 4: Important - Disable Authentication

After deployment:
1. Go to your project in Vercel dashboard
2. Click **Settings** → **Deployment Protection**
3. **Disable "Vercel Authentication"** (this is required for social preview images to work)

## Done!

Your site will be live at: `https://your-project-name.vercel.app`

You can also add a custom domain later in Settings → Domains.

