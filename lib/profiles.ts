// Profile management utilities using Redis and Blob storage
import { kv } from "@vercel/kv"
import { put, del } from "@vercel/blob"

// Profile type definition
export interface Profile {
  userId: string
  username: string
  displayName: string
  bio: string
  theme: string
  profileImage?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
  customization: {
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    buttonStyle?: string
    buttonShape?: string
    buttonAnimation?: string
    profileLayout?: string
    showLinkIcons?: boolean
    showLinkDescriptions?: boolean
    showProfileStats?: boolean
    customCSS?: string
  }
  views: number
  updatedAt: number
}

/**
 * Get a user's profile
 *
 * @param username Username
 * @returns Profile object or null if not found
 */
export async function getProfile(username: string): Promise<Profile | null> {
  // Get user data
  const userData = await kv.hgetall(`user:${username}`)

  if (!userData) {
    return null
  }

  // Get profile data
  const profileData = await kv.hgetall(`profile:${username}`)

  // Create default profile if it doesn't exist
  if (!profileData) {
    const defaultProfile: Profile = {
      userId: userData.id as string,
      username: username,
      displayName: (userData.displayName as string) || username,
      bio: (userData.bio as string) || "",
      theme: "default",
      profileImage: userData.profileImage as string,
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

    // Store default profile
    await kv.hset(`profile:${username}`, defaultProfile)

    return defaultProfile
  }

  return profileData as Profile
}

/**
 * Update a user's profile
 *
 * @param username Username
 * @param profileData Updated profile data
 * @returns The updated profile
 */
export async function updateProfile(username: string, profileData: Partial<Profile>): Promise<Profile | null> {
  // Get existing profile
  const existingProfile = await getProfile(username)

  if (!existingProfile) {
    return null
  }

  // Update profile
  const updatedProfile: Profile = {
    ...existingProfile,
    ...profileData,
    customization: {
      ...existingProfile.customization,
      ...(profileData.customization || {}),
    },
    updatedAt: Date.now(),
  }

  // Store updated profile
  await kv.hset(`profile:${username}`, updatedProfile)

  // Update user display name and bio if provided
  if (profileData.displayName || profileData.bio) {
    await kv.hset(`user:${username}`, {
      displayName: profileData.displayName || existingProfile.displayName,
      bio: profileData.bio || existingProfile.bio,
    })
  }

  return updatedProfile
}

/**
 * Upload a profile image
 *
 * @param username Username
 * @param file File data
 * @returns URL of the uploaded image
 */
export async function uploadProfileImage(username: string, file: Blob): Promise<string | null> {
  try {
    // Delete existing profile image if any
    const profile = await getProfile(username)
    if (profile?.profileImage) {
      try {
        await del(profile.profileImage)
      } catch (error) {
        console.error("Error deleting existing profile image:", error)
      }
    }

    // Upload new image
    const blob = await put(`profiles/${username}/profile-${Date.now()}.jpg`, file, {
      access: "public",
    })

    // Update profile with new image URL
    await kv.hset(`profile:${username}`, { profileImage: blob.url })

    // Also update user data
    await kv.hset(`user:${username}`, { profileImage: blob.url })

    return blob.url
  } catch (error) {
    console.error("Profile image upload error:", error)
    return null
  }
}

/**
 * Record a profile view
 *
 * @param username Username
 * @returns Updated view count
 */
export async function recordProfileView(username: string): Promise<number> {
  // Increment view count
  const views = await kv.hincrby(`profile:${username}`, "views", 1)

  // Record view in analytics
  const timestamp = Date.now()
  await kv.zadd(`profile:${username}:views`, { score: timestamp, member: timestamp })

  return views
}

/**
 * Get analytics for a profile
 *
 * @param username Username
 * @param days Number of days to get data for
 * @returns Analytics data
 */
export async function getProfileAnalytics(
  username: string,
  days = 30,
): Promise<{ views: number; viewsByDay: Record<string, number> }> {
  // Get total views
  const profile = await getProfile(username)
  const totalViews = profile?.views || 0

  // Get views by day
  const startTime = Date.now() - days * 24 * 60 * 60 * 1000

  // Use zrange instead of zrangebyscore
  // Format: zrange(key, min, max, { byScore: true })
  const viewTimestamps = await kv.zrange(`profile:${username}:views`, startTime, "+inf", { byScore: true })

  const viewsByDay: Record<string, number> = {}

  for (const timestamp of viewTimestamps) {
    const date = new Date(Number(timestamp))
    const dateString = date.toISOString().split("T")[0]

    if (!viewsByDay[dateString]) {
      viewsByDay[dateString] = 0
    }

    viewsByDay[dateString]++
  }

  return {
    views: totalViews,
    viewsByDay,
  }
}
