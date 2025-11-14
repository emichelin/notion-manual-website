// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'
// force white background and fix icons/images
import 'styles/white-background.css'
// conditional heading visibility
import 'styles/conditional-headings.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  hiddenHeadingLevels,
  isServer,
  posthogConfig,
  posthogId,
  shouldHideHeadings
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Apply conditional heading classes to body
  React.useEffect(() => {
    document.body.classList.toggle('hide-all-headings', shouldHideHeadings)

    // Apply classes for specific heading levels
    for (const level of hiddenHeadingLevels) {
      document.body.classList.add(`hide-h${level}`)
    }

    return () => {
      document.body.classList.remove('hide-all-headings')
      for (const level of hiddenHeadingLevels) {
        document.body.classList.remove(`hide-h${level}`)
      }
    }
  }, [])

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
