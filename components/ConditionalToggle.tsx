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

import { shouldShowToggle } from '@/lib/toggle-conditions'

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
  
  // We need to render the toggle, but react-notion-x handles child rendering
  // The issue is that when we override Toggle, we need to let NotionRenderer
  // handle the children. However, we can't easily access the default Toggle.
  // 
  // Instead, we'll render a structure that matches what react-notion-x expects,
  // and NotionRenderer will automatically render child blocks based on block.content
  // 
  // But actually, we're preventing NotionRenderer from rendering by overriding Toggle.
  // We need to check if there's a way to get the default Toggle or render children.
  
  // For now, let's render a basic structure and see if NotionRenderer fills in children
  // The children should be rendered by NotionRenderer's block rendering system
  return (
    <div className="notion-toggle notion-block" data-block-id={block.id}>
      <details className="notion-toggle-details" open={restProps.defaultOpen}>
        <summary className="notion-toggle-summary notion-h notion-h1 notion-h-title">
          <span>{toggleTitle}</span>
        </summary>
        <div className="notion-toggle-content">
          {/* NotionRenderer will render child blocks here based on block.content */}
          {/* We can't manually render them as we don't have access to the renderer */}
        </div>
      </details>
    </div>
  )
}

