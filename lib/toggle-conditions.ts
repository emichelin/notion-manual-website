/**
 * Toggle Block Conditional Rendering
 * 
 * Implements Bullet.so-style conditional rendering using toggle blocks
 * 
 * Usage in Notion:
 * - Toggle heading: {% if models contains "MFT-2000" %}
 * - Toggle heading: {% if models contains "MFT-2000" or models contains "MFT-5000" %}
 * - Toggle heading: bullet:Hide (to hide the toggle entirely)
 * 
 * URL parameter: ?models=MFT-2000,MFT-5000
 */

/**
 * Parse enabled models from URL parameter
 * Example: ?models=MFT-2000,MFT-5000
 */
export function parseEnabledModels(modelsParam: string | string[] | undefined): string[] {
  if (!modelsParam) return []
  
  const models = Array.isArray(modelsParam) ? modelsParam[0] : modelsParam
  if (!models) return []
  
  return models
    .split(',')
    .map((m) => m.trim().toUpperCase())
    .filter(Boolean)
}

/**
 * Check if a toggle block should be hidden
 * Returns true if toggle title is "bullet:Hide"
 */
export function shouldHideToggle(toggleTitle: string): boolean {
  return toggleTitle.trim().toLowerCase() === 'bullet:hide'
}

/**
 * Extract condition from toggle title
 * Supports: {% if models contains "MFT-2000" %}
 * Returns the condition string or null
 */
export function extractCondition(toggleTitle: string): string | null {
  // Match: {% if ... %}
  const match = toggleTitle.match(/\{%\s*if\s+(.+?)\s*%\}/i)
  return match ? match[1]!.trim() : null
}

/**
 * Evaluate a condition string
 * Supports:
 * - models contains "MFT-2000"
 * - models contains "MFT-2000" or models contains "MFT-5000"
 * - models contains "MFT-2000" and models contains "MFT-5000"
 */
export function evaluateCondition(
  condition: string,
  enabledModels: string[]
): boolean {
  if (!condition) return true

  // Normalize condition
  const normalized = condition.trim()

  // Handle OR conditions
  if (normalized.includes(' or ')) {
    const parts = normalized.split(/\s+or\s+/i)
    return parts.some((part) => evaluateCondition(part.trim(), enabledModels))
  }

  // Handle AND conditions
  if (normalized.includes(' and ')) {
    const parts = normalized.split(/\s+and\s+/i)
    return parts.every((part) => evaluateCondition(part.trim(), enabledModels))
  }

  // Handle "models contains" condition
  const containsMatch = normalized.match(/models\s+contains\s+["']([^"']+)["']/i)
  if (containsMatch) {
    const model = containsMatch[1]!.trim().toUpperCase()
    return enabledModels.includes(model)
  }

  // Handle "models" without contains (check if any model matches)
  const directMatch = normalized.match(/models\s*==\s*["']([^"']+)["']/i)
  if (directMatch) {
    const model = directMatch[1]!.trim().toUpperCase()
    return enabledModels.includes(model)
  }

  // Default: if no models specified, show (backward compatible)
  // If models specified but condition doesn't match, hide
  if (enabledModels.length === 0) {
    return true
  }

  return false
}

/**
 * Check if a toggle block should be shown
 * Returns true if toggle content should be displayed
 */
export function shouldShowToggle(
  toggleTitle: string,
  enabledModels: string[]
): boolean {
  // Hide if explicitly marked
  if (shouldHideToggle(toggleTitle)) {
    return false
  }

  // Extract condition from toggle title
  const condition = extractCondition(toggleTitle)
  
  // If no condition, show toggle (backward compatible)
  if (!condition) {
    return true
  }

  // Evaluate condition
  return evaluateCondition(condition, enabledModels)
}

