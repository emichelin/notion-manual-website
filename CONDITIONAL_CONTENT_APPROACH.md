# Conditional Content Visibility - Implementation Approaches

## Current Situation

Your Notion content contains markers like:
- `%Show(MFT-2000 + MFT-2000A + MFT-5000)%` - Show content for these models
- `%Hide (MFT-2000)%` - Hide content for this model

You want to conditionally show/hide content based on environment variables like:
```bash
NEXT_PUBLIC_ENABLED_MODELS=MFT-2000,MFT-5000
```

## Implementation Approaches

### Approach 1: Text Processing (Recommended for inline markers)

**How it works:**
- Process Notion text blocks to find and remove markers
- Check environment variables to determine visibility
- Remove markers and their associated content if conditions aren't met

**Pros:**
- Works with existing Notion content structure
- Handles inline markers in text
- Flexible - can process any text content

**Cons:**
- Requires parsing Notion's text structure
- More complex to implement
- Need to handle edge cases (markers in titles, callouts, etc.)

**Implementation:**
```typescript
// Process text to remove markers based on enabled models
function processConditionalText(text: string, enabledModels: string[]): string {
  // Remove %Show(...)% markers if models not enabled
  // Remove %Hide(...)% markers if models are enabled
  // Return cleaned text
}
```

### Approach 2: Block-Level Filtering (Recommended for sections)

**How it works:**
- Filter entire Notion blocks based on their content
- If a block contains markers that don't match enabled models, hide the entire block

**Pros:**
- Cleaner - hides entire sections
- Better for hiding complete steps/sections
- Easier to understand what's hidden

**Cons:**
- Less granular (hides whole blocks, not just text)
- Requires understanding Notion block structure
- May hide more than intended

**Implementation:**
```typescript
// Filter blocks before rendering
function shouldShowBlock(block: Block, enabledModels: string[]): boolean {
  // Check block content for markers
  // Return false if block should be hidden
}
```

### Approach 3: CSS-Based (Current heading approach)

**How it works:**
- Add CSS classes to blocks based on markers
- Use CSS to hide elements with specific classes

**Pros:**
- Simple implementation
- Works well for headings (already implemented)
- No text processing needed

**Cons:**
- Limited to block-level hiding
- Doesn't work well for inline markers
- Content still in DOM (just hidden)

**Implementation:**
```typescript
// Add classes to blocks based on markers
// Use CSS: .hide-mft-2000 { display: none !important; }
```

### Approach 4: Custom Notion Component (Most Flexible)

**How it works:**
- Create a custom React component that wraps conditional content
- Component checks environment variables and conditionally renders

**Pros:**
- Most flexible and maintainable
- Can handle complex logic
- Clean separation of concerns

**Cons:**
- Requires modifying Notion content structure
- Need to use Notion's component system
- More setup required

## Recommended Approach: Hybrid Solution

**For your use case, I recommend a combination:**

1. **Text Processing** for inline markers in titles/text
   - Process text to remove `%Show(...)%` and `%Hide(...)%` markers
   - Clean up titles and inline text

2. **Block Filtering** for entire sections
   - Hide complete blocks/sections that don't match enabled models
   - Better UX - entire sections disappear cleanly

3. **CSS Classes** for simple cases
   - Keep the heading visibility system
   - Use for simple show/hide scenarios

## Proposed Implementation

### Environment Variables
```bash
# Comma-separated list of enabled models
NEXT_PUBLIC_ENABLED_MODELS=MFT-2000,MFT-2000A,MFT-5000

# Or use customer-specific configuration
NEXT_PUBLIC_CUSTOMER_ID=customer123
NEXT_PUBLIC_ENABLED_MODELS=MFT-2000,MFT-5000
```

### Text Processing Function
```typescript
// Parse markers like: %Show(MFT-2000 + MFT-2000A + MFT-5000)%
// Check if any of the models are enabled
// Remove marker if condition not met
```

### Block Filtering
```typescript
// Check each block for markers
// Filter out blocks that should be hidden
// Return filtered recordMap
```

## Potential Conflicts & Considerations

### 1. **Build-time vs Runtime**
- Environment variables are embedded at **build time** in Next.js
- Each customer deployment needs its own build
- ✅ Good: Secure, no runtime overhead
- ⚠️ Consider: Need separate Vercel projects per customer

### 2. **Marker Syntax Conflicts**
- Current markers: `%Show(...)%` and `%Hide(...)%`
- ⚠️ Risk: If Notion uses `%` for other purposes
- ✅ Solution: Use unique syntax like `[[Show:...]]` or `<!--Show:...-->`

### 3. **Content Structure**
- Markers in titles vs. body text
- Markers spanning multiple blocks
- Nested conditions

### 4. **Performance**
- Text processing adds overhead
- Block filtering reduces content size
- Consider caching processed content

### 5. **Maintenance**
- Markers must be consistent in Notion
- Easy to make typos in model names
- Consider validation/warnings

## Questions to Consider

1. **Granularity**: Do you want to hide:
   - Entire sections/blocks? (Recommended)
   - Just the marker text? (Inline processing)
   - Both?

2. **Marker Syntax**: Are you open to changing the syntax?
   - Current: `%Show(MFT-2000 + MFT-2000A + MFT-5000)%`
   - Alternative: `[[Show:MFT-2000,MFT-2000A,MFT-5000]]`
   - Alternative: `<!--Show:MFT-2000,MFT-2000A,MFT-5000-->`

3. **Multiple Conditions**: How to handle:
   - `%Show(MFT-2000 + MFT-2000A + MFT-5000)%` - Show if ANY enabled?
   - `%Show(MFT-2000 & MFT-2000A)%` - Show if ALL enabled?
   - `%Show(MFT-2000 | MFT-2000A)%` - Show if ANY enabled?

4. **Deployment Strategy**:
   - One Vercel project per customer? (Recommended)
   - Single project with customer detection? (More complex)

## Recommendation

**Start with Block-Level Filtering + Text Processing:**

1. Parse Notion blocks for markers
2. Filter blocks that don't match enabled models
3. Clean up remaining text to remove markers
4. Use environment variables per customer deployment

This gives you:
- ✅ Clean section hiding
- ✅ Inline text cleanup
- ✅ Simple customer-specific deployments
- ✅ No runtime overhead
- ✅ Easy to maintain

Would you like me to implement this approach?

