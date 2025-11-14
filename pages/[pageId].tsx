import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    // Increase revalidate time to reduce unnecessary rebuilds
    // Pages will be regenerated on-demand via /api/revalidate
    return { props, revalidate: 3600 } // 1 hour
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMap = await getSiteMap()

  // Only pre-render the most important pages (root + first level)
  // Other pages will be generated on-demand (faster builds)
  const importantPages = Object.keys(siteMap.canonicalPageMap).slice(0, 10) // Pre-render first 10 pages
  
  const staticPaths = {
    paths: importantPages.map((pageId) => ({
      params: {
        pageId
      }
    })),
    fallback: 'blocking' // Generate missing pages on-demand
  }

  console.log(staticPaths.paths)
  return staticPaths
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
