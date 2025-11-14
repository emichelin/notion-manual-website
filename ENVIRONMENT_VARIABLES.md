# Environment Variables Guide

This document explains all environment variables used in the nextjs-notion-starter-kit and how they work.

## How Environment Variables Work

Environment variables in Next.js work differently depending on whether they're prefixed with `NEXT_PUBLIC_`:

- **`NEXT_PUBLIC_*`**: Exposed to the browser/client-side code. Can be accessed in both server and client components.
- **Without `NEXT_PUBLIC_`**: Only available on the server-side (during build and API routes).

## Available Environment Variables

### Analytics (Optional)

#### Fathom Analytics
```bash
NEXT_PUBLIC_FATHOM_ID=your_fathom_id
```
- **Purpose**: Lightweight analytics alternative to Google Analytics
- **Usage**: Only used in production (disabled in dev mode)
- **Location**: `lib/config.ts` → `fathomId`

#### PostHog Analytics
```bash
NEXT_PUBLIC_POSTHOG_ID=your_posthog_id
```
- **Purpose**: Open-source analytics platform
- **Usage**: Available in both dev and production
- **Location**: `lib/config.ts` → `posthogId`

### Redis Caching (Optional)

For caching preview images to speed up builds:

```bash
REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password
REDIS_USER=default  # Optional, defaults to 'default'
REDIS_NAMESPACE=preview-images  # Optional, defaults to 'preview-images'
REDIS_ENABLED=true  # Optional, can also enable in site.config.ts
```

- **Purpose**: Cache generated preview images to speed up subsequent builds
- **Required**: Only `REDIS_HOST` and `REDIS_PASSWORD` are required
- **Location**: `lib/config.ts` → `redisHost`, `redisPassword`, etc.
- **Note**: You must also set `isRedisEnabled: true` in `site.config.ts`

### Twitter Integration (Optional)

```bash
TWITTER_ACCESS_TOKEN=your_token
```
- **Purpose**: For rendering tweets more efficiently
- **Location**: Used in `lib/get-tweets.ts`

### Site Configuration Override (Advanced)

```bash
NEXT_PUBLIC_SITE_CONFIG='{"rootNotionPageId":"..."}'
```
- **Purpose**: Override `site.config.ts` values via environment variables
- **Format**: JSON string
- **Location**: `lib/get-config-value.ts`

### Vercel-Specific

```bash
VERCEL_URL=your-deployment.vercel.app  # Automatically set by Vercel
PORT=3000  # For local development
NODE_ENV=production|development  # Automatically set
```

## Custom Environment Variables for Conditional Content

You can add your own environment variables to conditionally show/hide content. For example:

```bash
# Hide headings for specific customers
NEXT_PUBLIC_HIDE_HEADINGS=true
NEXT_PUBLIC_CUSTOMER_ID=customer123
NEXT_PUBLIC_SHOW_ADVANCED_FEATURES=false
```

These can be accessed in your components using:
- Client-side: `process.env.NEXT_PUBLIC_*`
- Server-side: `process.env.*`

## Setting Environment Variables

### Local Development
Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_FATHOM_ID=your_id
REDIS_HOST=your_host
```

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables for:
   - **Production**
   - **Preview** (optional)
   - **Development** (optional)

### Important Notes

1. **Security**: Never commit `.env.local` to git (it's in `.gitignore`)
2. **Client-side exposure**: Variables prefixed with `NEXT_PUBLIC_` are bundled into the client code and visible in the browser
3. **Build-time**: Environment variables are embedded at build time, not runtime
4. **Restart required**: After adding new env vars, restart your dev server or redeploy

## References

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [nextjs-notion-starter-kit GitHub](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)

