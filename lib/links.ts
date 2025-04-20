// Link management utilities using Redis
import { kv } from "@vercel/kv"

// Link type definition
export interface Link {
  id: string
  userId: string
  title: string
  url: string
  type: string
  isPublic: boolean
  position: number
  createdAt: number
  updatedAt: number
  clicks: number
}

/**
 * Create a new link for a user
 *
 * @param userId User ID
 * @param linkData Link data
 * @returns The created link
 */
export async function createLink(userId: string, linkData: Partial<Link>): Promise<Link> {
  const linkId = `link_${Date.now()}`

  const link: Link = {
    id: linkId,
    userId,
    title: linkData.title || "New Link",
    url: linkData.url || "",
    type: linkData.type || "website",
    isPublic: linkData.isPublic !== undefined ? linkData.isPublic : true,
    position: linkData.position || 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    clicks: 0,
  }

  // Store link in Redis
  await kv.hset(`link:${linkId}`, link)

  // Add to user's links set
  await kv.sadd(`user:${userId}:links`, linkId)

  return link
}

/**
 * Get all links for a user
 *
 * @param userId User ID
 * @returns Array of links
 */
export async function getLinksByUser(userId: string): Promise<Link[]> {
  // Get all link IDs for the user
  const linkIds = await kv.smembers(`user:${userId}:links`)

  if (!linkIds || linkIds.length === 0) {
    return []
  }

  // Get all links
  const links: Link[] = []

  for (const linkId of linkIds) {
    const link = await kv.hgetall(`link:${linkId}`)
    if (link) {
      links.push(link as Link)
    }
  }

  // Sort by position
  return links.sort((a, b) => a.position - b.position)
}

/**
 * Update a link
 *
 * @param linkId Link ID
 * @param linkData Updated link data
 * @returns The updated link
 */
export async function updateLink(linkId: string, linkData: Partial<Link>): Promise<Link | null> {
  // Get existing link
  const existingLink = await kv.hgetall(`link:${linkId}`)

  if (!existingLink) {
    return null
  }

  // Update link
  const updatedLink: Link = {
    ...(existingLink as Link),
    ...linkData,
    updatedAt: Date.now(),
  }

  // Store updated link
  await kv.hset(`link:${linkId}`, updatedLink)

  return updatedLink
}

/**
 * Delete a link
 *
 * @param linkId Link ID
 * @param userId User ID
 * @returns True if successful, false otherwise
 */
export async function deleteLink(linkId: string, userId: string): Promise<boolean> {
  try {
    // Remove from user's links set
    await kv.srem(`user:${userId}:links`, linkId)

    // Delete link
    await kv.del(`link:${linkId}`)

    return true
  } catch (error) {
    console.error("Delete link error:", error)
    return false
  }
}

/**
 * Record a click on a link
 *
 * @param linkId Link ID
 * @returns Updated click count
 */
export async function recordLinkClick(linkId: string): Promise<number> {
  // Increment click count
  const clicks = await kv.hincrby(`link:${linkId}`, "clicks", 1)

  // Record click in analytics
  const timestamp = Date.now()
  await kv.zadd(`link:${linkId}:clicks`, { score: timestamp, member: timestamp })

  return clicks
}

/**
 * Get public links for a user's profile
 *
 * @param username Username
 * @returns Array of public links
 */
export async function getPublicLinksByUsername(username: string): Promise<Link[]> {
  // Get user data
  const userData = await kv.hgetall(`user:${username}`)

  if (!userData) {
    return []
  }

  // Get all links for the user
  const links = await getLinksByUser(userData.id as string)

  // Filter public links
  return links.filter((link) => link.isPublic).sort((a, b) => a.position - b.position)
}
