import { type NextApiRequest, type NextApiResponse } from 'next'

/**
 * On-demand revalidation API endpoint
 * 
 * Usage:
 * - Manual: POST /api/revalidate?secret=YOUR_SECRET&path=/page-slug
 * - Webhook: Configure Notion webhook to call this endpoint
 * 
 * Environment variable required:
 * - REVALIDATE_SECRET: Secret token for authentication
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
    const path = req.query.path as string

    if (!path) {
      return res.status(400).json({ message: 'Path is required' })
    }

    // Revalidate the specific page
    await res.revalidate(path)

    return res.json({ revalidated: true, path, now: Date.now() })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

