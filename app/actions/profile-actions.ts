"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"
import { getProfile, updateProfile, uploadProfileImage, recordProfileView, getProfileAnalytics } from "@/lib/profiles"

/**
 * Update a user's profile
 */
export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to update your profile",
    }
  }

  const displayName = formData.get("displayName") as string
  const bio = formData.get("bio") as string
  const theme = formData.get("theme") as string

  // Get customization options
  const backgroundColor = formData.get("backgroundColor") as string
  const textColor = formData.get("textColor") as string
  const fontFamily = formData.get("fontFamily") as string
  const buttonStyle = formData.get("buttonStyle") as string

  try {
    const profile = await updateProfile(user.username, {
      displayName,
      bio,
      theme,
      customization: {
        backgroundColor,
        textColor,
        fontFamily,
        buttonStyle,
      },
    })

    if (!profile) {
      return {
        error: "Profile not found",
      }
    }

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      profile,
    }
  } catch (error) {
    console.error("Update profile error:", error)
    return {
      error: "Failed to update profile. Please try again.",
    }
  }
}

/**
 * Upload a profile image
 */
export async function uploadUserProfileImage(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to upload a profile image",
    }
  }

  const file = formData.get("image") as File

  if (!file) {
    return {
      error: "No image provided",
    }
  }

  try {
    const imageUrl = await uploadProfileImage(user.username, file)

    if (!imageUrl) {
      return {
        error: "Failed to upload image",
      }
    }

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      imageUrl,
    }
  } catch (error) {
    console.error("Profile image upload error:", error)
    return {
      error: "Failed to upload profile image. Please try again.",
    }
  }
}

/**
 * Get a user's profile
 */
export async function getUserProfile(username: string) {
  try {
    const profile = await getProfile(username)

    if (!profile) {
      return {
        error: "Profile not found",
      }
    }

    return {
      success: true,
      profile,
    }
  } catch (error) {
    console.error("Get profile error:", error)
    return {
      error: "Failed to get profile. Please try again.",
    }
  }
}

/**
 * Track a profile view
 */
export async function trackProfileView(username: string) {
  try {
    await recordProfileView(username)
    return { success: true }
  } catch (error) {
    console.error("Track profile view error:", error)
    return { error: "Failed to track profile view" }
  }
}

/**
 * Get profile analytics
 */
export async function getAnalytics(days = 30) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to view analytics",
    }
  }

  try {
    const analytics = await getProfileAnalytics(user.username, days)

    return {
      success: true,
      analytics,
    }
  } catch (error) {
    console.error("Get analytics error:", error)
    return {
      error: "Failed to get analytics. Please try again.",
    }
  }
}
