import { kv } from "@vercel/kv"

/**
 * Utility function to check if a Redis key exists
 *
 * @param key Redis key
 * @returns Boolean indicating if the key exists
 */
export async function keyExists(key: string): Promise<boolean> {
  try {
    return (await kv.exists(key)) === 1
  } catch (error) {
    console.error(`Error checking if key ${key} exists:`, error)
    return false
  }
}

/**
 * Utility function to get all keys matching a pattern
 *
 * @param pattern Redis key pattern
 * @returns Array of keys
 */
export async function getKeys(pattern: string): Promise<string[]> {
  try {
    return await kv.keys(pattern)
  } catch (error) {
    console.error(`Error getting keys matching pattern ${pattern}:`, error)
    return []
  }
}

/**
 * Utility function to delete multiple keys
 *
 * @param keys Array of keys to delete
 * @returns Number of keys deleted
 */
export async function deleteKeys(keys: string[]): Promise<number> {
  if (keys.length === 0) return 0

  try {
    return await kv.del(...keys)
  } catch (error) {
    console.error(`Error deleting keys:`, error)
    return 0
  }
}

/**
 * Utility function to clear all user data
 *
 * @param username Username
 * @returns Boolean indicating success
 */
export async function clearUserData(username: string): Promise<boolean> {
  try {
    // Get user data
    const userData = await kv.hgetall(`user:${username}`)
    if (!userData) return false

    // Get user's links
    const userId = userData.id // Fix: Declare userId
    const linkIds = await kv.smembers(`user:${userId}:links`)

    // Delete links
    for (const linkId of linkIds) {
      await kv.del(`link:${linkId}`)
    }

    // Delete user's profile
    await kv.del(`profile:${username}`)

    // Delete user's sessions
    const sessionKeys = await getKeys(`session:*`)
    for (const sessionKey of sessionKeys) {
      const sessionUsername = await kv.get(sessionKey)
      if (sessionUsername === username) {
        await kv.del(sessionKey)
      }
    }

    // Delete user
    await kv.del(`user:${username}`)

    // Delete email index
    if (userData.email) {
      await kv.del(`email:${userData.email}`)
    }

    // Remove from users set
    await kv.srem("users", username)

    return true
  } catch (error) {
    console.error(`Error clearing user data for ${username}:`, error)
    return false
  }
}

/**
 * Utility function to fix Redis key structure issues
 *
 * @returns Boolean indicating success
 */
export async function fixRedisKeyStructure(): Promise<boolean> {
  try {
    // Get all users
    const users = await kv.smembers("users")

    for (const username of users) {
      // Get user data
      const userData = await kv.hgetall(`user:${username}`)
      if (!userData) continue

      // Fix user links set
      const userLinksKey = `user:${userData.id}:links`
      const userLinksExist = await keyExists(userLinksKey)

      if (!userLinksExist) {
        // Create empty set for user links
        await kv.sadd(userLinksKey, [])
      }

      // Fix profile
      const profileKey = `profile:${username}`
      const profileExists = await keyExists(profileKey)

      if (!profileExists) {
        // Create default profile
        const defaultProfile = {
          userId: userData.id,
          username,
          displayName: userData.displayName || username,
          bio: userData.bio || "",
          theme: "default",
          customization: {
            buttonStyle: "default",
            buttonShape: "rounded",
            profileLayout: "standard",
            showLinkIcons: true,
            showProfileStats: false,
          },
          views: 0,
          updatedAt: Date.now(),
        }

        await kv.hset(profileKey, defaultProfile)
      }
    }

    return true
  } catch (error) {
    console.error("Error fixing Redis key structure:", error)
    return false
  }
}

/**
 * Utility function to get all users
 *
 * @returns Array of users
 */
export async function getAllUsers(): Promise<any[]> {
  try {
    const usernames = await kv.smembers("users")
    const users = []

    for (const username of usernames) {
      const userData = await kv.hgetall(`user:${username}`)
      if (userData) {
        // Remove password from user data
        const { password, ...user } = userData
        users.push(user)
      }
    }

    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

/**
 * Utility function to get system stats
 *
 * @returns System stats
 */
export async function getSystemStats(): Promise<any> {
  try {
    const users = await getAllUsers()
    let totalLinks = 0
    let totalViews = 0
    let totalClicks = 0

    for (const user of users) {
      // Get user links
      const linkIds = await kv.smembers(`user:${user.id}:links`)
      totalLinks += linkIds.length

      // Get profile views
      const profile = await kv.hgetall(`profile:${user.username}`)
      if (profile) {
        totalViews += profile.views || 0
      }

      // Get link clicks
      for (const linkId of linkIds) {
        const link = await kv.hgetall(`link:${linkId}`)
        if (link) {
          totalClicks += link.clicks || 0
        }
      }
    }

    return {
      totalUsers: users.length,
      totalLinks,
      totalViews,
      totalClicks,
    }
  } catch (error) {
    console.error("Error getting system stats:", error)
    return {
      totalUsers: 0,
      totalLinks: 0,
      totalViews: 0,
      totalClicks: 0,
    }
  }
}
