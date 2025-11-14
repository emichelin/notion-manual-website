# Conditional Heading Visibility Guide

This guide explains how to conditionally hide headings for different customers using environment variables.

## Overview

The purpose of this feature is to allow you to deploy the same Notion content to different customers while hiding specific headings based on customer-specific environment variables.

## How It Works

1. **Environment Variables**: Set environment variables in Vercel (or `.env.local` for local development)
2. **CSS Classes**: The app automatically applies CSS classes to the `<body>` element
3. **CSS Rules**: The `conditional-headings.css` file hides headings based on these classes

## Usage

### Option 1: Hide All Headings

To hide **all headings** for a specific customer deployment:

```bash
NEXT_PUBLIC_HIDE_HEADINGS=true
```

**In Vercel:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Key**: `NEXT_PUBLIC_HIDE_HEADINGS`
   - **Value**: `true`
   - **Environment**: Select the environment (Production, Preview, or Development)

### Option 2: Hide Specific Heading Levels

To hide only specific heading levels (e.g., H1, H2, and H3):

```bash
NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2,3
```

**Examples:**
- Hide only H1: `NEXT_PUBLIC_HIDE_HEADING_LEVELS=1`
- Hide H1 and H2: `NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2`
- Hide H1, H2, and H3: `NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2,3`

### Option 3: Customer-Specific Configuration

You can combine with customer identification:

```bash
NEXT_PUBLIC_CUSTOMER_ID=customer123
NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2
```

This allows you to:
- Identify which customer is viewing the site
- Apply different heading visibility rules per customer
- Track usage per customer

## Implementation Details

### Files Modified

1. **`lib/config.ts`**: Added configuration functions
   - `shouldHideHeadings`: Boolean flag
   - `hiddenHeadingLevels`: Array of heading levels to hide
   - `shouldHideHeadingLevel(level)`: Helper function
   - `customerId`: Customer identifier

2. **`styles/conditional-headings.css`**: CSS rules that hide headings
   - `.hide-all-headings`: Hides all headings
   - `.hide-h1`, `.hide-h2`, etc.: Hide specific heading levels

3. **`pages/_app.tsx`**: Applies CSS classes to `<body>` element based on environment variables

### How Headings Are Hidden

The CSS uses:
- `display: none !important`
- `visibility: hidden !important`
- `height: 0 !important`
- `margin: 0 !important`
- `padding: 0 !important`

This ensures headings are completely removed from the layout and don't take up any space.

## Examples

### Example 1: Basic Customer Deployment

**Customer A** - Show all headings:
```bash
# No environment variables needed (default behavior)
```

**Customer B** - Hide all headings:
```bash
NEXT_PUBLIC_HIDE_HEADINGS=true
```

### Example 2: Advanced Customer Deployment

**Customer A** - Hide only H1:
```bash
NEXT_PUBLIC_CUSTOMER_ID=customer-a
NEXT_PUBLIC_HIDE_HEADING_LEVELS=1
```

**Customer B** - Hide H1, H2, and H3:
```bash
NEXT_PUBLIC_CUSTOMER_ID=customer-b
NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2,3
```

### Example 3: Multiple Vercel Deployments

You can create multiple Vercel projects for different customers:

1. **Project: customer-a-site**
   - Environment Variable: `NEXT_PUBLIC_HIDE_HEADING_LEVELS=1`

2. **Project: customer-b-site**
   - Environment Variable: `NEXT_PUBLIC_HIDE_HEADINGS=true`

3. **Project: customer-c-site**
   - Environment Variable: `NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2,3`

All three projects can use the same GitHub repository but will show different content based on their environment variables.

## Testing Locally

1. Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_HIDE_HEADING_LEVELS=1,2
```

2. Restart your dev server:
```bash
npm run dev
```

3. Check the browser - H1 and H2 headings should be hidden.

## Troubleshooting

### Headings are not hiding

1. **Check environment variable name**: Must be exactly `NEXT_PUBLIC_HIDE_HEADINGS` or `NEXT_PUBLIC_HIDE_HEADING_LEVELS`
2. **Restart dev server**: Environment variables are loaded at build time
3. **Check browser console**: Look for any CSS errors
4. **Verify CSS is loaded**: Check that `conditional-headings.css` is imported in `_app.tsx`

### Only some headings are hiding

- Make sure you're using the correct heading level numbers (1-6)
- Check that the CSS classes are being applied to the `<body>` element
- Verify the Notion content uses standard heading blocks (H1, H2, etc.)

### Environment variables not working in production

1. **Vercel**: Make sure variables are set in the correct environment (Production, Preview, or Development)
2. **Redeploy**: After adding environment variables, trigger a new deployment
3. **Check variable names**: They must start with `NEXT_PUBLIC_` to be available in the browser

## Advanced Usage

### Custom CSS Rules

You can extend the CSS in `styles/conditional-headings.css` to hide other elements:

```css
.hide-all-headings .notion-callout {
  display: none !important;
}
```

### Programmatic Access

In your components, you can check the configuration:

```typescript
import { shouldHideHeadings, shouldHideHeadingLevel } from '@/lib/config'

// Check if all headings should be hidden
if (shouldHideHeadings) {
  // Do something
}

// Check if a specific level should be hidden
if (shouldHideHeadingLevel(1)) {
  // H1 is hidden
}
```

## References

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

