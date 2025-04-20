// WARNING: This is for development purposes only!
// Remove this file in production

import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    // Get all keys
    const keys = await kv.keys("*")

    // Delete all keys
    if (keys.length > 0) {
      await kv.del(...keys)
    }

    return NextResponse.json({ success: true, message: "Database reset successfully" })
  } catch (error) {
    console.error("Error resetting database:", error)
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 })
  }
}
