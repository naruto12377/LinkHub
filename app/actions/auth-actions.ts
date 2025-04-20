"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { registerUser, loginUser, createSession, logoutUser, getUserBySession, initializeAdmin } from "@/lib/auth"

// Initialize admin account
initializeAdmin().catch(console.error)

/**
 * Register a new user
 */
export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const displayName = (formData.get("displayName") as string) || username

  if (!email || !username || !password) {
    return {
      error: "All fields are required",
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      error: "Invalid email format",
    }
  }

  // Validate username (alphanumeric, underscores, no spaces)
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return {
      error: "Username can only contain letters, numbers, and underscores",
    }
  }

  // Validate password length
  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters",
    }
  }

  try {
    const user = await registerUser(email, username, password, displayName)

    if (!user) {
      return {
        error: "Username or email already exists",
      }
    }

    // Create session
    const sessionId = await createSession(username)

    // Set session cookie
    cookies().set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      error: "Registration failed. Please try again.",
    }
  }
}

/**
 * Login a user
 */
export async function login(formData: FormData) {
  const usernameOrEmail = formData.get("usernameOrEmail") as string
  const password = formData.get("password") as string

  if (!usernameOrEmail || !password) {
    return {
      error: "All fields are required",
    }
  }

  try {
    const user = await loginUser(usernameOrEmail, password)

    if (!user) {
      return {
        error: "Invalid credentials",
      }
    }

    // Create session
    const sessionId = await createSession(user.username)

    // Set session cookie
    cookies().set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      error: "Login failed. Please try again.",
    }
  }
}

/**
 * Logout a user
 */
export async function logout() {
  const sessionId = cookies().get("session")?.value

  if (sessionId) {
    await logoutUser(sessionId)
  }

  cookies().delete("session")
  redirect("/login")
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const sessionId = cookies().get("session")?.value

  if (!sessionId) {
    return null
  }

  return getUserBySession(sessionId)
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Check if the user is an admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.isAdmin || false
}
