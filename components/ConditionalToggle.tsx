/**
 * Conditional Toggle Component
 * 
 * Implements Bullet.so-style conditional rendering for toggle blocks
 * 
 * Usage in Notion toggle heading:
 * - {% if models contains "MFT-2000" %}
 * - {% if models contains "MFT-2000" or models contains "MFT-5000" %}
 * - bullet:Hide (to hide toggle entirely)
 */

import { type Block } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'

import { shouldShowToggle } from '@/lib/toggle-conditions'

interface ConditionalToggleProps {
  block: Block
  recordMap: any
  enabledModels: string[]
  children?: React.ReactNode
  [key: string]: any // Allow all other props to pass through
}

export function ConditionalToggle(props: ConditionalToggleProps) {
  const { block, recordMap, enabledModels, children } = props
  
  // Get toggle title
  const toggleTitle = getBlockTitle(block, recordMap) || ''

  // Check if toggle should be shown
  const shouldShow = React.useMemo(() => {
    return shouldShowToggle(toggleTitle, enabledModels)
  }, [toggleTitle, enabledModels])

  // If toggle should be hidden, return null
  if (!shouldShow) {
    return null
  }

  // Render toggle structure - matching react-notion-x's toggle structure
  // The children will contain the toggle content rendered by NotionRenderer
  return (
    <div className="notion-toggle notion-block" data-block-id={block.id}>
      <details className="notion-toggle-details">
        <summary className="notion-toggle-summary notion-h notion-h1 notion-h-title">
          {toggleTitle}
        </summary>
        <div className="notion-toggle-content">
          {children}
        </div>
      </details>
    </div>
  )
}

