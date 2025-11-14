# Toggle Block Conditional Rendering

## Overview

This implementation provides Bullet.so-style conditional rendering using Notion toggle blocks. Content inside toggle blocks is shown or hidden based on URL parameters.

## How It Works

### In Notion

Create toggle blocks with conditions in the toggle heading:

1. **Show for specific models:**
   ```
   {% if models contains "MFT-2000" %}
   ```
   Content inside this toggle will only show if `MFT-2000` is in the URL.

2. **Show for multiple models (OR):**
   ```
   {% if models contains "MFT-2000" or models contains "MFT-5000" %}
   ```
   Content shows if **any** of the models match.

3. **Show for multiple models (AND):**
   ```
   {% if models contains "MFT-2000" and models contains "MFT-5000" %}
   ```
   Content shows only if **all** models match.

4. **Hide toggle entirely:**
   ```
   bullet:Hide
   ```
   The toggle block will not be rendered at all.

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
```
Toggle: {% if models contains "MFT-2000" %}
  Content: Installation steps for MFT-2000
```

**URLs:**
- `?models=MFT-2000` → ✅ Shows toggle content
- `?models=MFT-5000` → ❌ Hides toggle content
- No parameter → ❌ Hides toggle (condition requires models param)

### Example 2: OR Condition

**In Notion:**
```
Toggle: {% if models contains "MFT-2000" or models contains "MFT-5000" %}
  Content: Installation steps for MFT-2000 or MFT-5000
```

**URLs:**
- `?models=MFT-2000` → ✅ Shows (MFT-2000 matches)
- `?models=MFT-5000` → ✅ Shows (MFT-5000 matches)
- `?models=MFT-2000,MFT-5000` → ✅ Shows (both match)
- `?models=MFT-3000` → ❌ Hides (no match)

### Example 3: AND Condition

**In Notion:**
```
Toggle: {% if models contains "MFT-2000" and models contains "MFT-5000" %}
  Content: Advanced setup for both models
```

**URLs:**
- `?models=MFT-2000,MFT-5000` → ✅ Shows (both match)
- `?models=MFT-2000` → ❌ Hides (MFT-5000 missing)
- `?models=MFT-5000` → ❌ Hides (MFT-2000 missing)

### Example 4: Hide Toggle

**In Notion:**
```
Toggle: bullet:Hide
  Content: Internal notes (not shown on website)
```

**Result:** Toggle is completely hidden on the website.

## Syntax Reference

### Condition Syntax

- `{% if models contains "MODEL-NAME" %}` - Check if model is in URL
- `{% if models contains "MODEL-1" or models contains "MODEL-2" %}` - OR logic
- `{% if models contains "MODEL-1" and models contains "MODEL-2" %}` - AND logic
- `bullet:Hide` - Hide toggle entirely

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

