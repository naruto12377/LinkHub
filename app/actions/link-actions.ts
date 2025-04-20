"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth-actions"
import { createLink, getLinksByUser, updateLink, deleteLink, recordLinkClick } from "@/lib/links"

/**
 * Create a new link
 */
export async function addLink(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to create links",
    }
  }

  const title = formData.get("title") as string
  const url = formData.get("url") as string
  const type = formData.get("type") as string
  const isPublic = formData.get("isPublic") === "true"

  if (!title || !url) {
    return {
      error: "Title and URL are required",
    }
  }

  try {
    // Get existing links to determine position
    const existingLinks = await getLinksByUser(user.id)
    const position = existingLinks.length

    const link = await createLink(user.id, {
      title,
      url,
      type,
      isPublic,
      position,
    })

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      link,
    }
  } catch (error) {
    console.error("Create link error:", error)
    return {
      error: "Failed to create link. Please try again.",
    }
  }
}

/**
 * Get all links for the current user
 */
export async function getUserLinks() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to view your links",
    }
  }

  try {
    const links = await getLinksByUser(user.id)

    return {
      success: true,
      links,
    }
  } catch (error) {
    console.error("Get links error:", error)
    return {
      error: "Failed to get links. Please try again.",
    }
  }
}

/**
 * Update a link
 */
export async function updateUserLink(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to update links",
    }
  }

  const linkId = formData.get("id") as string
  const title = formData.get("title") as string
  const url = formData.get("url") as string
  const type = formData.get("type") as string
  const isPublic = formData.get("isPublic") === "true"

  if (!linkId || !title || !url) {
    return {
      error: "Link ID, title, and URL are required",
    }
  }

  try {
    const link = await updateLink(linkId, {
      title,
      url,
      type,
      isPublic,
    })

    if (!link) {
      return {
        error: "Link not found",
      }
    }

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      link,
    }
  } catch (error) {
    console.error("Update link error:", error)
    return {
      error: "Failed to update link. Please try again.",
    }
  }
}

/**
 * Delete a link
 */
export async function deleteUserLink(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to delete links",
    }
  }

  const linkId = formData.get("id") as string

  if (!linkId) {
    return {
      error: "Link ID is required",
    }
  }

  try {
    const success = await deleteLink(linkId, user.id)

    if (!success) {
      return {
        error: "Failed to delete link",
      }
    }

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Delete link error:", error)
    return {
      error: "Failed to delete link. Please try again.",
    }
  }
}

/**
 * Update link positions (after drag and drop)
 */
export async function updateLinkPositions(links: { id: string; position: number }[]) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to update links",
    }
  }

  try {
    for (const link of links) {
      await updateLink(link.id, { position: link.position })
    }

    revalidatePath(`/dashboard`)
    revalidatePath(`/editor`)
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Update link positions error:", error)
    return {
      error: "Failed to update link positions. Please try again.",
    }
  }
}

/**
 * Track a link click
 */
export async function trackLinkClick(linkId: string) {
  try {
    await recordLinkClick(linkId)
    return { success: true }
  } catch (error) {
    console.error("Track link click error:", error)
    return { error: "Failed to track link click" }
  }
}
