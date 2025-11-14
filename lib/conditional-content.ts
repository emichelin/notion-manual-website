/**
 * Conditional Content Visibility
 * 
 * Handles URL parameter-based conditional content filtering
 * Example: ?models=MFT-2000,MFT-5000
 * 
 * Markers in Notion content:
 * - %Show(MFT-2000 + MFT-2000A + MFT-5000)% - Show if ANY model matches
 * - %Hide(MFT-2000)% - Hide if model matches
 */

import { type ExtendedRecordMap } from 'notion-types'
import { getBlockTitle } from 'notion-utils'

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
 * Check if a model list matches enabled models
 * Handles: %Show(MFT-2000 + MFT-2000A + MFT-5000)%
 * Returns true if ANY model in the list is enabled
 */
export function matchesModels(
  markerContent: string,
  enabledModels: string[]
): boolean {
  if (enabledModels.length === 0) {
    // If no models specified, show everything (backward compatible)
    return true
  }

  // Extract models from marker: "MFT-2000 + MFT-2000A + MFT-5000"
  // Support both "+" and "," as separators
  const modelsInMarker = markerContent
    .split(/[+,]/)
    .map((m) => m.trim().toUpperCase())
    .filter(Boolean)

  // Check if ANY model in marker matches ANY enabled model
  return modelsInMarker.some((model) => enabledModels.includes(model))
}

/**
 * Extract Show markers from text
 * Returns array of model lists: ["MFT-2000 + MFT-2000A + MFT-5000"]
 */
export function extractShowMarkers(text: string): string[] {
  const markers: string[] = []
  // Match: %Show(MFT-2000 + MFT-2000A + MFT-5000)%
  const regex = /%Show\(([^)]+)\)%/gi
  let match

  while ((match = regex.exec(text)) !== null) {
    markers.push(match[1]!.trim())
  }

  return markers
}

/**
 * Extract Hide markers from text
 * Returns array of model lists: ["MFT-2000"]
 */
export function extractHideMarkers(text: string): string[] {
  const markers: string[] = []
  // Match: %Hide(MFT-2000)% or %Hide (MFT-2000)%
  const regex = /%Hide\s*\(([^)]+)\)%/gi
  let match

  while ((match = regex.exec(text)) !== null) {
    markers.push(match[1]!.trim())
  }

  return markers
}

/**
 * Remove markers from text
 * Cleans up: %Show(...)% and %Hide(...)%
 */
export function removeMarkers(text: string): string {
  return text
    .replaceAll(/%Show\([^)]+\)%/g, '')
    .replaceAll(/%Hide\s*\([^)]+\)%/g, '')
    .trim()
}

/**
 * Check if a page should be shown based on enabled models
 * 
 * Logic:
 * 1. If page title contains %Show(...)%, check if any model matches
 * 2. If page title contains %Hide(...)%, check if model matches (hide if true)
 * 3. If no markers, show page (backward compatible)
 */
export function shouldShowPage(
  recordMap: ExtendedRecordMap | undefined,
  enabledModels: string[]
): boolean {
  if (!recordMap) return true

  // Get page title
  const keys = Object.keys(recordMap.block || {})
  if (keys.length === 0) return true

  const block = recordMap.block[keys[0]!]?.value
  if (!block) return true

  const title = getBlockTitle(block, recordMap) || ''

  // Check for Hide markers first (higher priority)
  const hideMarkers = extractHideMarkers(title)
  for (const hideMarker of hideMarkers) {
    if (matchesModels(hideMarker, enabledModels)) {
      // If hide condition matches, hide the page
      return false
    }
  }

  // Check for Show markers
  const showMarkers = extractShowMarkers(title)
  if (showMarkers.length > 0) {
    // If there are Show markers, at least one must match
    const anyMatches = showMarkers.some((marker) =>
      matchesModels(marker, enabledModels)
    )
    return anyMatches
  }

  // No markers found - show page (backward compatible)
  return true
}

/**
 * Process text content to remove markers
 * Used for cleaning up titles and text after filtering
 */
export function processTextContent(text: string): string {
  return removeMarkers(text)
}

