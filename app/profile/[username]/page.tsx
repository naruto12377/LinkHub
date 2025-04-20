"use client"

import { getProfile } from "@/lib/profiles"
import { getPublicLinksByUsername } from "@/lib/links"
import { getThemeById, getButtonStyle } from "@/lib/themes"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"
import Image from "next/image"
import { trackProfileView } from "@/app/actions/profile-actions"
import { trackLinkClick } from "@/app/actions/link-actions"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  // Get profile data
  const profile = await getProfile(username)
  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-gray-500 dark:text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Get public links
  const links = await getPublicLinksByUsername(username)

  // Track profile view (don't await to avoid blocking)
  trackProfileView(username).catch(console.error)

  // Get theme
  const theme = getThemeById(profile.theme || "default")

  return (
    <div className={`flex min-h-screen flex-col items-center ${theme.backgroundCSS}`}>
      <div className="w-full max-w-md px-4 py-8">
        <div className={`flex flex-col items-center text-center ${theme.colors.text}`}>
          <div className={`h-24 w-24 overflow-hidden rounded-full border-4 ${theme.colors.accent}`}>
            <Image
              src={profile.profileImage || "/placeholder.svg?height=96&width=96"}
              width={96}
              height={96}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className={`mt-4 text-2xl font-bold ${theme.fontFamily} ${theme.colors.primary}`}>@{profile.username}</h1>
          <p className={`text-sm ${theme.colors.secondary}`}>{profile.bio}</p>
        </div>
        <div className="mt-8 grid gap-4">
          {links.map((link) => (
            <Card key={link.id} className={`overflow-hidden ${theme.cardStyle}`}>
              {link.isPublic ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-3 font-medium ${getButtonStyle(
                    theme,
                    link.type,
                    link.isPublic,
                  )}`}
                  onClick={() => trackLinkClick(link.id)}
                >
                  {link.title}
                </a>
              ) : (
                <div className="flex items-center justify-center rounded-md bg-gray-100 p-3 font-medium dark:bg-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{link.title}</span>
                  <Lock className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">Powered by LinkHub</div>
      </div>
    </div>
  )
}
