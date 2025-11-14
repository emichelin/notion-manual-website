# Optimized Deployment Guide

## Overview

The site is now optimized for incremental deployments:
- **All pages pre-rendered**: All pages are built initially for fast access
- **Selective updates**: Only modified pages are rebuilt on-demand
- **On-demand revalidation**: Update specific pages without full deployment

## How It Works

### 1. Incremental Static Regeneration (ISR)
- Pages revalidate every 1 hour (instead of 10 seconds)
- Reduces unnecessary rebuilds
- Pages are cached and served instantly

### 2. On-Demand Revalidation

#### Update a single page:
```bash
# Revalidate a specific page after modifying it in Notion
curl -X POST "https://your-site.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/page-slug"

# Revalidate homepage
curl -X POST "https://your-site.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/"
```

#### Update all pages (after bulk changes):
```bash
# Revalidate all pages at once
curl -X POST "https://your-site.vercel.app/api/revalidate-all?secret=YOUR_SECRET"
```

### 3. Setup Webhook (Optional)

#### Option A: Using Vercel Cron Jobs
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/revalidate",
    "schedule": "0 * * * *"
  }]
}
```

#### Option B: Notion Webhook (if available)
Configure Notion to call your revalidation endpoint when pages change.

#### Option C: Manual Trigger
Use the API endpoint manually when you update Notion content.

## Environment Variables

Add to Vercel dashboard:
```
REVALIDATE_SECRET=your-secret-token-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Benefits

✅ **Faster deployments**: Only builds essential pages upfront
✅ **Selective updates**: Revalidate only changed pages
✅ **Better caching**: 1-hour cache reduces API calls
✅ **On-demand generation**: Pages created when needed

## Usage Examples

### Revalidate after Notion update:
```bash
# After updating a specific page in Notion
curl -X POST "https://notion-manual-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/reciprocating--all-options-mft-2000-mft-2000a-mft-5000"
```

### Revalidate multiple pages:
```bash
for path in "/page1" "/page2" "/page3"; do
  curl -X POST "https://notion-manual-website.vercel.app/api/revalidate?secret=YOUR_SECRET&path=$path"
done
```

## Notes

- First visit to a page may be slower (on-demand generation)
- Subsequent visits are instant (cached)
- Full rebuilds still work for major changes
- `fetchMissingBlocks: true` ensures synced blocks are loaded

