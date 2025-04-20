// Authentication utilities using Redis for session storage
import { createHash } from "crypto"
import { kv } from "@vercel/kv"

// User type definition
export interface User {
  id: string
  username: string
  email: string
  displayName: string
  bio: string
  profileImage?: string
  isAdmin: boolean
  createdAt: number
}

/**
 * Register a new user
 *
 * @param email User's email
 * @param username User's username
 * @param password User's password
 * @param displayName User's display name
 * @returns The created user or null if registration failed
 */
export async function registerUser(
  email: string,
  username: string,
  password: string,
  displayName: string,
): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await kv.hget(`user:${username}`, "email")
    if (existingUser) {
      return null // Username already taken
    }

    const emailExists = await kv.get(`email:${email}`)
    if (emailExists) {
      return null // Email already registered
    }

    // Hash the password
    const hashedPassword = hashPassword(password)

    // Create user ID
    const userId = `user_${Date.now()}`

    // Create user object
    const user: User = {
      id: userId,
      username,
      email,
      displayName: displayName || username,
      bio: "",
      isAdmin: false,
      createdAt: Date.now(),
    }

    // Store user data in Redis
    await kv.hset(`user:${username}`, {
      ...user,
      password: hashedPassword,
    })

    // Create email index for lookup
    await kv.set(`email:${email}`, username)

    // Add to users list
    await kv.sadd("users", username)

    return user
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}

/**
 * Authenticate a user
 *
 * @param usernameOrEmail Username or email
 * @param password Password
 * @returns The user object if authentication succeeds, null otherwise
 */
export async function loginUser(usernameOrEmail: string, password: string): Promise<User | null> {
  try {
    let username = usernameOrEmail

    // Check if login is with email
    if (usernameOrEmail.includes("@")) {
      const emailLookup = await kv.get(`email:${usernameOrEmail}`)
      if (!emailLookup) return null
      username = emailLookup as string
    }

    // Get user data
    const userData = await kv.hgetall(`user:${username}`)
    if (!userData) return null

    // Verify password
    const hashedPassword = hashPassword(password)
    if (userData.password !== hashedPassword) {
      return null
    }

    // Create session
    const sessionId = `session_${Date.now()}`
    await kv.set(`session:${sessionId}`, username, { ex: 60 * 60 * 24 * 7 }) // 7 days expiry

    // Return user without password
    const { password: _, ...user } = userData
    return user as User
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

/**
 * Get user by session ID
 *
 * @param sessionId Session ID
 * @returns User object or null if session is invalid
 */
export async function getUserBySession(sessionId: string): Promise<User | null> {
  try {
    const username = await kv.get(`session:${sessionId}`)
    if (!username) return null

    const userData = await kv.hgetall(`user:${username}`)
    if (!userData) return null

    const { password: _, ...user } = userData
    return user as User
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

/**
 * Hash a password
 *
 * @param password Plain text password
 * @returns Hashed password
 */
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

/**
 * Create a session for a user
 *
 * @param username Username
 * @returns Session ID
 */
export async function createSession(username: string): Promise<string> {
  const sessionId = `session_${Date.now()}`
  await kv.set(`session:${sessionId}`, username, { ex: 60 * 60 * 24 * 7 }) // 7 days expiry
  return sessionId
}

/**
 * Logout a user by invalidating their session
 *
 * @param sessionId Session ID
 */
export async function logoutUser(sessionId: string): Promise<void> {
  await kv.del(`session:${sessionId}`)
}

// Admin credentials - IMPORTANT: Change these in production!
// These are only for demo purposes
export const ADMIN_USERNAME = "admin"
export const ADMIN_PASSWORD = "admin123"
export const ADMIN_EMAIL = "admin@linkhub.com"

/**
 * Initialize the admin account if it doesn't exist
 */
export async function initializeAdmin(): Promise<void> {
  const adminExists = await kv.exists(`user:${ADMIN_USERNAME}`)

  if (!adminExists) {
    const hashedPassword = hashPassword(ADMIN_PASSWORD)

    const admin: User = {
      id: "admin_1",
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      displayName: "Admin",
      bio: "LinkHub Administrator",
      isAdmin: true,
      createdAt: Date.now(),
    }

    await kv.hset(`user:${ADMIN_USERNAME}`, {
      ...admin,
      password: hashedPassword,
    })

    await kv.set(`email:${ADMIN_EMAIL}`, ADMIN_USERNAME)
    await kv.sadd("users", ADMIN_USERNAME)

    console.log("Admin account created")
  }
}
