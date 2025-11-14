# URL-Based Conditional Content Visibility

## Overview

This implementation allows you to conditionally show/hide pages based on URL parameters. This is perfect for a single Vercel deployment that serves multiple customers with different model configurations.

## How It Works

### URL Parameter Format

Add `?models=` parameter to any URL:

```
https://notion-manual-website.vercel.app/rotary--all-options-showmft-2000-mft-2000a-mft-5000?models=MFT-2000,MFT-5000
```

### Marker Syntax in Notion

In your Notion content, use these markers:

1. **Show Marker**: `%Show(MFT-2000 + MFT-2000A + MFT-5000)%`
   - Page is shown if **ANY** model in the list matches the URL parameter
   - Example: If URL has `?models=MFT-2000`, page with `%Show(MFT-2000 + MFT-5000)%` will show

2. **Hide Marker**: `%Hide(MFT-2000)%`
   - Page is hidden if the model matches the URL parameter
   - Example: If URL has `?models=MFT-2000`, page with `%Hide(MFT-2000)%` will be hidden

### Logic Flow

1. User visits URL with `?models=MFT-2000,MFT-5000`
2. System parses enabled models: `["MFT-2000", "MFT-5000"]`
3. System checks page title for markers:
   - If `%Show(...)%` found: Show page if ANY model matches
   - If `%Hide(...)%` found: Hide page if model matches
   - If no markers: Show page (backward compatible)
4. If page should be hidden: Show 404 page
5. If page should be shown: Remove markers from title and content

## Usage Examples

### Example 1: Show for Multiple Models

**Notion Title:**
```
Rotary - All Options %Show(MFT-2000 + MFT-2000A + MFT-5000)%
```

**URLs:**
- `?models=MFT-2000` → ✅ Shows (MFT-2000 matches)
- `?models=MFT-5000` → ✅ Shows (MFT-5000 matches)
- `?models=MFT-3000` → ❌ Hidden (no match)
- No parameter → ✅ Shows (backward compatible)

### Example 2: Hide for Specific Model

**Notion Title:**
```
Advanced Setup %Hide(MFT-2000)%
```

**URLs:**
- `?models=MFT-2000` → ❌ Hidden (MFT-2000 matches hide condition)
- `?models=MFT-5000` → ✅ Shows (MFT-2000 not in URL)
- No parameter → ✅ Shows (backward compatible)

### Example 3: Multiple Conditions

**Notion Title:**
```
Rotary - All Options %Show(MFT-2000 + MFT-2000A + MFT-5000)%
```

**URLs:**
- `?models=MFT-2000,MFT-5000` → ✅ Shows (both match)
- `?models=MFT-2000` → ✅ Shows (MFT-2000 matches)
- `?models=MFT-3000` → ❌ Hidden (no match)

## Implementation Details

### Files Modified

1. **`lib/conditional-content.ts`** (NEW)
   - `parseEnabledModels()` - Parses URL parameter
   - `shouldShowPage()` - Checks if page should be shown
   - `processTextContent()` - Removes markers from text
   - `extractShowMarkers()` / `extractHideMarkers()` - Extract markers

2. **`components/NotionPage.tsx`**
   - Added URL parameter parsing
   - Added conditional page visibility check
   - Added marker cleanup in titles
   - Added custom text component for content processing

### Marker Syntax Investigation

The `%Show(...)%` and `%Hide(...)%` syntax:
- ✅ **Safe**: `%` is not used by Notion for formatting
- ✅ **Visible**: Markers appear in Notion content (easy to see/edit)
- ✅ **Unique**: Unlikely to conflict with other content
- ⚠️ **Note**: If you find conflicts, we can switch to `[[Show:...]]` or `<!--Show:...-->`

## Advantages of URL Parameters

1. **Single Deployment**: One Vercel project for all customers
2. **Runtime Configuration**: No rebuild needed for different customers
3. **Flexible**: Easy to test different model combinations
4. **Shareable**: URLs can be bookmarked/shared with specific model configs
5. **SEO Friendly**: Different URLs for different model sets

## Customer Deployment Strategy

### Option 1: URL Parameters (Recommended)

Each customer gets a URL with their models:
```
https://notion-manual-website.vercel.app/?models=MFT-2000,MFT-5000
```

**Pros:**
- Single deployment
- Easy to manage
- Flexible testing

**Cons:**
- URLs are longer
- Models visible in URL

### Option 2: Subdomain with Rewrite

Use Vercel rewrites to map subdomains to URLs:
```
customer-a.manual-site.com → ?models=MFT-2000
customer-b.manual-site.com → ?models=MFT-5000
```

**Pros:**
- Clean URLs per customer
- Professional appearance

**Cons:**
- Requires DNS setup
- More complex configuration

### Option 3: Path-Based

Use path segments:
```
/manual/MFT-2000,MFT-5000/rotary--all-options
```

**Pros:**
- Clean structure
- Easy to understand

**Cons:**
- Requires custom routing
- More complex implementation

## Testing

### Local Testing

1. Start dev server:
```bash
npm run dev
```

2. Visit page with models:
```
http://localhost:3000/rotary--all-options-showmft-2000-mft-2000a-mft-5000?models=MFT-2000
```

3. Test different combinations:
```
?models=MFT-2000
?models=MFT-5000
?models=MFT-2000,MFT-5000
?models=MFT-3000  # Should hide page
```

### Production Testing

1. Deploy to Vercel
2. Test with production URL:
```
https://notion-manual-website.vercel.app/rotary--all-options-showmft-2000-mft-2000a-mft-5000?models=MFT-2000
```

## Troubleshooting

### Page Not Showing

1. **Check URL parameter**: Ensure `?models=` is correctly formatted
2. **Check marker syntax**: Verify `%Show(...)%` or `%Hide(...)%` in Notion
3. **Check model names**: Must match exactly (case-insensitive)
4. **Check console**: Look for errors in browser console

### Markers Still Visible

1. **Clear cache**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. **Check implementation**: Verify `processTextContent()` is being called
3. **Check component**: Ensure custom text component is registered

### Page Shows When It Shouldn't

1. **Check logic**: Verify `shouldShowPage()` logic
2. **Check markers**: Ensure markers are in page title (not just content)
3. **Check URL**: Verify models parameter is correct

## Future Enhancements

1. **Block-level filtering**: Hide entire sections, not just pages
2. **AND logic**: Support `%Show(MFT-2000 & MFT-5000)%` (both required)
3. **Nested conditions**: Support complex logic
4. **UI selector**: Add dropdown to select models without URL editing
5. **Cookie persistence**: Remember selected models in cookie

## References

- [Next.js URL Parameters](https://nextjs.org/docs/routing/dynamic-routes)
- [Vercel Rewrites](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)

