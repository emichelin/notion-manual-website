/**
 * Toggle Block Conditional Rendering
 * 
 * Implements Bullet.so-style conditional rendering using toggle blocks
 * 
 * Usage in Notion (toggle heading formatted as inline code):
 * - Toggle heading (inline code): {% if mft-2000 %}
 * - Toggle heading (inline code): {% if mft-2000 or mft-5000 %}
 * - Toggle heading (inline code): bullet:hide (to hide the toggle entirely)
 * 
 * URL parameter: ?models=MFT-2000,MFT-5000
 * 
 * Note: The toggle heading text should be formatted as inline code in Notion,
 * matching Bullet.so's structure: https://bullet.so/docs/hiding-blocks-in-bullet/
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
 * Returns true if toggle title is "bullet:hide" (case-insensitive)
 * Supports Bullet.so format: inline code `bullet:hide`
 * The text may include backticks or other formatting, so we strip them
 */
export function shouldHideToggle(toggleTitle: string): boolean {
  // Remove backticks and other formatting markers
  // Handle both `bullet:hide` and bullet:hide formats
  const cleaned = toggleTitle
    .replaceAll('`', '') // Remove backticks
    .trim()
    .toLowerCase()
  
  return cleaned === 'bullet:hide'
}

/**
 * Extract condition from toggle title
 * Supports:
 * - {% if mft-2000 %}
 * - {% if models contains "MFT-2000" %}
 * - {% if mft-2000 or mft-5000 %}
 * Returns the condition string or null
 */
export function extractCondition(toggleTitle: string): string | null {
  // Remove backticks (inline code formatting)
  const cleaned = toggleTitle.replaceAll('`', '').trim()
  
  // Match: {% if ... %}
  const match = cleaned.match(/\{%\s*if\s+(.+?)\s*%\}/i)
  return match ? match[1]!.trim() : null
}

/**
 * Evaluate a condition string
 * Supports:
 * - mft-2000 (simple model name)
 * - mft-2000 or mft-5000 (OR logic)
 * - mft-2000 and mft-5000 (AND logic)
 * - models contains "MFT-2000" (legacy format)
 */
export function evaluateCondition(
  condition: string,
  enabledModels: string[]
): boolean {
  if (!condition) return true

  // Normalize condition - remove quotes and extra spaces
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

  // Handle "models contains" condition (legacy format)
  const containsMatch = normalized.match(/models\s+contains\s+["']([^"']+)["']/i)
  if (containsMatch) {
    const model = containsMatch[1]!.trim().toUpperCase()
    return enabledModels.includes(model)
  }

  // Handle simple model name (e.g., "mft-2000" or "MFT-2000")
  // This is the primary format: {% if mft-2000 %}
  const modelName = normalized
    .replaceAll('"', '')
    .replaceAll("'", '') // Remove quotes if present
    .trim()
    .toUpperCase()
  
  // Check if this model name is in the enabled models list
  if (modelName && enabledModels.includes(modelName)) {
    return true
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

