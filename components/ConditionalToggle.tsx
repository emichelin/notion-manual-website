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
import { useNotionContext } from 'react-notion-x'

import { shouldShowToggle } from '@/lib/toggle-conditions'

interface ConditionalToggleProps {
  block: Block
  recordMap: any
  enabledModels: string[]
  [key: string]: any // Allow all other props to pass through
}

export function ConditionalToggle(props: ConditionalToggleProps) {
  const { block, recordMap, enabledModels, ...restProps } = props
  const { recordMap: contextRecordMap } = useNotionContext()
  
  // Use recordMap from props or context
  const finalRecordMap = recordMap || contextRecordMap
  
  // Get toggle title
  const toggleTitle = getBlockTitle(block, finalRecordMap) || ''

  // Check if toggle should be shown
  const shouldShow = React.useMemo(() => {
    const result = shouldShowToggle(toggleTitle, enabledModels)
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('ConditionalToggle:', {
        toggleTitle,
        enabledModels,
        shouldShow: result,
        blockId: block.id
      })
    }
    return result
  }, [toggleTitle, enabledModels, block.id])

  // If toggle should be hidden, return null
  if (!shouldShow) {
    return null
  }
  
  // Render toggle structure - react-notion-x will render child blocks
  // We need to match the structure that react-notion-x expects
  // The key is that NotionRenderer will automatically render child blocks
  // based on block.content, so we just need the structure
  return (
    <div className="notion-toggle notion-block" data-block-id={block.id}>
      <details className="notion-toggle-details" open={restProps.defaultOpen}>
        <summary className="notion-toggle-summary notion-h notion-h1 notion-h-title">
          <span>{toggleTitle}</span>
        </summary>
        <div className="notion-toggle-content">
          {/* Child blocks are rendered by NotionRenderer automatically */}
          {/* The block.content array tells NotionRenderer which blocks to render */}
        </div>
      </details>
    </div>
  )
}

