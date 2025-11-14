# Toggle Block Conditional Rendering

## Overview

This implementation provides Bullet.so-style conditional rendering using Notion toggle blocks. Content inside toggle blocks is shown or hidden based on URL parameters.

## How It Works

### In Notion

Create toggle blocks with conditions in the toggle heading. **Important: Format the toggle heading text as inline code** (select text and press `Cmd/Ctrl + E` or use the inline code button).

1. **Show for specific models:**
   - Create a toggle block
   - Set toggle heading to: `{% if mft-2000 %}` (formatted as inline code)
   - Content inside this toggle will only show if `MFT-2000` is in the URL

2. **Show for multiple models (OR):**
   - Toggle heading (inline code): `{% if mft-2000 or mft-5000 %}`
   - Content shows if **any** of the models match

3. **Show for multiple models (AND):**
   - Toggle heading (inline code): `{% if mft-2000 and mft-5000 %}`
   - Content shows only if **all** models match

4. **Hide toggle entirely:**
   - Toggle heading (inline code): `bullet:hide`
   - The toggle block will not be rendered at all

**Reference:** [Bullet.so - Hiding blocks in Bullet](https://bullet.so/docs/hiding-blocks-in-bullet/)

### URL Parameters

Add `?models=` to your URL:

```
https://notion-manual-website.vercel.app/page?models=MFT-2000,MFT-5000
```

- Multiple models: comma-separated (`MFT-2000,MFT-5000`)
- Case-insensitive (automatically converted to uppercase)
- If no `?models=` parameter: all toggles without conditions show (backward compatible)

## Examples

### Example 1: Simple Condition

**In Notion:**
1. Create a toggle block
2. Set toggle heading to: `{% if mft-2000 %}` (formatted as inline code)
3. Add content inside the toggle

**URLs:**
- `?models=MFT-2000` → ✅ Shows toggle content
- `?models=MFT-5000` → ❌ Hides toggle content
- No parameter → ❌ Hides toggle (condition requires models param)

### Example 2: OR Condition

**In Notion:**
- Toggle heading (inline code): `{% if mft-2000 or mft-5000 %}`
- Content: Installation steps for MFT-2000 or MFT-5000

**URLs:**
- `?models=MFT-2000` → ✅ Shows (MFT-2000 matches)
- `?models=MFT-5000` → ✅ Shows (MFT-5000 matches)
- `?models=MFT-2000,MFT-5000` → ✅ Shows (both match)
- `?models=MFT-3000` → ❌ Hides (no match)

### Example 3: AND Condition

**In Notion:**
- Toggle heading (inline code): `{% if mft-2000 and mft-5000 %}`
- Content: Advanced setup for both models

**URLs:**
- `?models=MFT-2000,MFT-5000` → ✅ Shows (both match)
- `?models=MFT-2000` → ❌ Hides (MFT-5000 missing)
- `?models=MFT-5000` → ❌ Hides (MFT-2000 missing)

### Example 4: Hide Toggle

**In Notion:**
1. Create a toggle block
2. Set toggle heading to: `bullet:hide` (formatted as inline code)
3. Add content inside the toggle

**Result:** Toggle is completely hidden on the website.

## Syntax Reference

### Condition Syntax

**Important:** All toggle headings must be formatted as **inline code** in Notion.

- `{% if mft-2000 %}` - Check if model is in URL (case-insensitive)
- `{% if mft-2000 or mft-5000 %}` - OR logic
- `{% if mft-2000 and mft-5000 %}` - AND logic
- `bullet:hide` - Hide toggle entirely

**Legacy format (still supported):**
- `{% if models contains "MFT-2000" %}` - Legacy format, still works

### URL Parameter Format

- Single model: `?models=MFT-2000`
- Multiple models: `?models=MFT-2000,MFT-5000`
- Case-insensitive: `?models=mft-2000` works the same as `?models=MFT-2000`

## Implementation Details

### Files

1. **`lib/toggle-conditions.ts`**
   - `parseEnabledModels()` - Parses URL parameter
   - `shouldShowToggle()` - Checks if toggle should be shown
   - `evaluateCondition()` - Evaluates condition logic
   - `extractCondition()` - Extracts condition from toggle title

2. **`components/ConditionalToggle.tsx`**
   - Custom toggle component that checks conditions
   - Returns `null` if toggle should be hidden
   - Renders toggle structure if condition passes

3. **`components/NotionPage.tsx`**
   - Parses URL parameters
   - Passes `enabledModels` to `ConditionalToggle`
   - Overrides default Toggle component

### How It Works

1. User visits URL with `?models=MFT-2000,MFT-5000`
2. System parses models: `["MFT-2000", "MFT-5000"]`
3. For each toggle block:
   - Extract toggle title
   - Check for condition: `{% if ... %}`
   - Evaluate condition against enabled models
   - Show/hide toggle content accordingly

## Advantages Over Previous System

✅ **Cleaner**: No markers in page titles  
✅ **Flexible**: Can use anywhere in content  
✅ **Visual**: Easy to see in Notion  
✅ **Scalable**: Easy to add more conditions  
✅ **Maintainable**: Structured approach  

## Testing

### Local Testing

1. Start dev server:
```bash
npm run dev
```

2. Visit page with models:
```
http://localhost:3000/page?models=MFT-2000
```

3. Check browser console for debug logs (in development mode)

### Production Testing

After deployment, test with:
```
https://notion-manual-website.vercel.app/page?models=MFT-2000,MFT-5000
```

## Troubleshooting

### Toggle Not Showing

1. **Check URL parameter**: Ensure `?models=` is correctly formatted
2. **Check condition syntax**: Verify `{% if models contains "MODEL" %}` format
3. **Check model names**: Must match exactly (case-insensitive)
4. **Check browser console**: Look for debug logs in development

### Toggle Showing When It Shouldn't

1. **Check condition logic**: Verify OR/AND logic
2. **Check URL**: Ensure correct models in parameter
3. **Check toggle title**: Ensure condition is in toggle heading (not content)

### Toggle Content Not Rendering

1. **Check toggle structure**: Ensure toggle has content inside
2. **Check Notion sync**: Ensure page is synced and public
3. **Clear cache**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

## Future Enhancements

1. **Database properties**: Support conditions based on Notion properties
2. **Complex logic**: Support nested conditions
3. **UI selector**: Add dropdown to select models without URL editing
4. **Cookie persistence**: Remember selected models

## References

- [Bullet.so Conditional Rendering Docs](https://bullet.so/docs/conditional-rendering/)
- [Next.js URL Parameters](https://nextjs.org/docs/routing/dynamic-routes)

