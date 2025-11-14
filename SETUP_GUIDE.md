# Setup Guide for Your Notion Manual Website

## Step 1: Make Your Notion Page Public

1. Open your Notion workspace
2. Navigate to the page you want to use as your homepage (this will be the root page)
3. Click the **Share** button (top right)
4. Enable **"Share to web"** to make it public
5. Copy the shareable link

## Step 2: Get Your Notion Page ID

From your Notion page URL, extract the page ID:
- URL format: `https://www.notion.so/Your-Page-Title-7875426197cf461698809def95960ebf`
- The page ID is the last part: `7875426197cf461698809def95960ebf`

## Step 3: Update Configuration

Edit `site.config.ts` and update:

1. **rootNotionPageId**: Replace with your Notion page ID from Step 2
2. **name**: Your website name (e.g., "User Manuals")
3. **author**: Your name
4. **description**: A brief description of your manual website
5. **domain**: Your domain (when deploying, e.g., "manuals.yourdomain.com")

## Step 4: Test Locally

Run the development server:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser to see your site.

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Vercel will automatically detect Next.js and deploy
4. **Important**: In Vercel project settings, disable "Vercel Authentication" under Deployment Protection (this is required for social preview images to work)

## Tips for Organizing Your Manuals

- Create a database/collection on your root Notion page to list all your manuals
- Each manual can be a separate Notion page
- Use Notion's built-in features like tables of contents, images, and formatting
- The website will automatically generate pretty URLs from your page titles

## Optional: Custom URLs

If you want custom URLs for specific pages, add them to `pageUrlOverrides` in `site.config.ts`:

```typescript
pageUrlOverrides: {
  '/getting-started': 'your-page-id-here',
  '/advanced': 'another-page-id-here'
}
```

