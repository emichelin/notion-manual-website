import { type NextApiRequest, type NextApiResponse } from 'next'

import { getSiteMap } from '@/lib/get-site-map'

/**
 * Revalidate all pages that have been modified
 * 
 * Usage:
 * POST /api/revalidate-all?secret=YOUR_SECRET
 * 
 * This will revalidate all pages in your Notion site.
 * Use this after making bulk changes in Notion.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const siteMap = await getSiteMap()
    const paths = Object.keys(siteMap.canonicalPageMap)
    
    // Revalidate all pages
    const revalidated = []
    const errors = []

    for (const pageId of paths) {
      try {
        const path = `/${pageId}`
        await res.revalidate(path)
        revalidated.push(path)
      } catch (err) {
        errors.push({
          path: `/${pageId}`,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    // Also revalidate the homepage
    try {
      await res.revalidate('/')
      revalidated.push('/')
    } catch (err) {
      errors.push({
        path: '/',
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    }

    return res.json({
      revalidated: true,
      count: revalidated.length,
      paths: revalidated,
      errors: errors.length > 0 ? errors : undefined,
      now: Date.now()
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Error revalidating pages',
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

