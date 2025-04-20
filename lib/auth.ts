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
    // Check if username already exists
    const usernameExists = await kv.exists(`user:${username}`)
    if (usernameExists) {
      console.log(`Username ${username} already exists`)
      return null // Username already taken
    }

    // Check if email already exists
    const emailExists = await kv.exists(`email:${email}`)
    if (emailExists) {
      console.log(`Email ${email} already exists`)
      return null // Email already registered
    }

    // Hash the password
    const hashedPassword = hashPassword(password)

    // Create user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

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

    console.log(`User ${username} registered successfully`)
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
      if (!emailLookup) {
        console.log(`Email ${usernameOrEmail} not found`)
        return null
      }
      username = emailLookup as string
    }

    // Get user data
    const userData = await kv.hgetall(`user:${username}`)
    if (!userData) {
      console.log(`User ${username} not found`)
      return null
    }

    // Verify password
    const hashedPassword = hashPassword(password)
    if (userData.password !== hashedPassword) {
      console.log(`Invalid password for user ${username}`)
      return null
    }

    // Return user without password
    const { password: _, ...user } = userData
    console.log(`User ${username} logged in successfully`)
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
    if (!sessionId) return null

    const username = await kv.get(`session:${sessionId}`)
    if (!username) {
      console.log(`Invalid session: ${sessionId}`)
      return null
    }

    const userData = await kv.hgetall(`user:${username}`)
    if (!userData) {
      console.log(`User not found for session: ${sessionId}`)
      return null
    }

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
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  await kv.set(`session:${sessionId}`, username, { ex: 60 * 60 * 24 * 7 }) // 7 days expiry
  console.log(`Session created for user ${username}: ${sessionId}`)
  return sessionId
}

/**
 * Logout a user by invalidating their session
 *
 * @param sessionId Session ID
 */
export async function logoutUser(sessionId: string): Promise<void> {
  await kv.del(`session:${sessionId}`)
  console.log(`Session invalidated: ${sessionId}`)
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
  try {
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

      console.log("Admin account created successfully")
    } else {
      console.log("Admin account already exists")
    }
  } catch (error) {
    console.error("Error initializing admin:", error)
  }
}
