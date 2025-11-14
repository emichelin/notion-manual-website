/**
 * Conditional Toggle Component
 * 
 * Implements Bullet.so-style conditional rendering for toggle blocks
 * 
 * Usage in Notion (toggle heading formatted as inline code):
 * - Toggle heading (inline code): {% if mft-2000 %}
 * - Toggle heading (inline code): {% if mft-2000 or mft-5000 %}
 * - Toggle heading (inline code): bullet:hide (to hide toggle entirely)
 * 
 * Reference: https://bullet.so/docs/hiding-blocks-in-bullet/
 */

import { type Block } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'
import { useNotionContext } from 'react-notion-x'

import { extractCondition, shouldShowToggle } from '@/lib/toggle-conditions'

interface ConditionalToggleProps {
  block: Block
  recordMap: any
  enabledModels: string[]
  [key: string]: any // Allow all other props to pass through
}

export function ConditionalToggle(props: ConditionalToggleProps) {
  const { block, recordMap, enabledModels, ...restProps } = props
  
  // Get recordMap from context (this component is always rendered within NotionRenderer)
  const context = useNotionContext()
  const contextRecordMap = context?.recordMap
  
  // Use recordMap from props (preferred) or context (fallback)
  const finalRecordMap = recordMap || contextRecordMap
  
  // Get toggle title
  const toggleTitle = getBlockTitle(block, finalRecordMap) || ''

  // Check if toggle should be shown
  const shouldShow = React.useMemo(() => {
    const result = shouldShowToggle(toggleTitle, enabledModels)
    // Debug logging - always log to help with testing
    console.log('ConditionalToggle:', {
      toggleTitle,
      enabledModels,
      shouldShow: result,
      blockId: block.id,
      hasCondition: !!extractCondition(toggleTitle)
    })
    return result
  }, [toggleTitle, enabledModels, block.id])

  // If toggle should be hidden, return null
  if (!shouldShow) {
    return null
  }
  
  // Render toggle structure
  // Note: Child blocks should be rendered by NotionRenderer automatically
  // based on block.content, but since we're overriding Toggle, we may need
  // to handle child rendering differently. For now, we render the structure
  // and rely on NotionRenderer's block rendering system.
  return (
    <div className="notion-toggle notion-block" data-block-id={block.id}>
      <details className="notion-toggle-details" open={restProps.defaultOpen}>
        <summary className="notion-toggle-summary notion-h notion-h1 notion-h-title">
          <span>{toggleTitle}</span>
        </summary>
        <div className="notion-toggle-content">
          {/* Child blocks are rendered by NotionRenderer based on block.content */}
        </div>
      </details>
    </div>
  )
}

