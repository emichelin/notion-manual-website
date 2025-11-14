# Deploy Your Notion Manual Website Online

Your site is currently only available locally at `http://localhost:3000`. To make it available online, you need to deploy it.

## Option 1: Deploy via Vercel Web Interface (Easiest - Recommended)

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `notion-manual-website`)
3. **Don't** initialize with README, .gitignore, or license

### Step 2: Push Your Code to GitHub

```bash
cd ~/notion-manual-website

# Add your changes
git add site.config.ts SETUP_GUIDE.md get-page-id.md

# Commit your changes
git commit -m "Configure for manual website"

# Change remote to your new repository
git remote set-url origin https://github.com/YOUR_USERNAME/notion-manual-website.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign up/login (free account)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**
6. Wait 2-3 minutes for deployment
7. **IMPORTANT**: After deployment, go to:
   - Project Settings → Deployment Protection
   - **Disable "Vercel Authentication"** (required for social preview images)

Your site will be live at: `https://your-project-name.vercel.app`

---

## Option 2: Deploy via Vercel CLI (Faster)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd ~/notion-manual-website
vercel
```

Follow the prompts:
- Login to Vercel (will open browser)
- Accept defaults for project settings
- Deploy!

### Step 3: Important Settings

After deployment, go to Vercel dashboard:
- Project Settings → Deployment Protection
- **Disable "Vercel Authentication"**

---

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

---

## Notes

- Your Notion page must be **public** (Share → "Share to web")
- The site will automatically rebuild when you push changes to GitHub
- Vercel free tier is perfect for this use case

