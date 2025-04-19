import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"
import Image from "next/image"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  // This would be fetched from a database in a real application
  const profile = {
    username,
    displayName: "John Doe",
    bio: "Digital Creator & Influencer",
    links: [
      {
        id: 1,
        title: "My Website",
        url: "https://example.com",
        type: "website",
        isPublic: true,
      },
      {
        id: 2,
        title: "Instagram",
        url: "https://instagram.com/username",
        type: "instagram",
        isPublic: true,
      },
      {
        id: 3,
        title: "WhatsApp Community",
        url: "https://whatsapp.com/group/link",
        type: "whatsapp",
        isPublic: true,
      },
      {
        id: 4,
        title: "YouTube Channel",
        url: "https://youtube.com/c/username",
        type: "youtube",
        isPublic: true,
      },
      {
        id: 5,
        title: "LinkedIn Profile",
        url: "https://linkedin.com/in/username",
        type: "linkedin",
        isPublic: true,
      },
      {
        id: 6,
        title: "Premium Content",
        url: "#",
        type: "premium",
        isPublic: false,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary">
            <Image
              src="/placeholder.svg?height=96&width=96"
              width={96}
              height={96}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold">@{profile.username}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.bio}</p>
        </div>
        <div className="mt-8 grid gap-4">
          {profile.links.map((link) => (
            <Card key={link.id} className="overflow-hidden">
              {link.isPublic ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center p-3 font-medium ${getLinkStyle(link.type)}`}
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

function getLinkStyle(type: string): string {
  switch (type) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    case "website":
      return "bg-primary text-primary-foreground"
    case "whatsapp":
      return "bg-green-500 text-white"
    case "youtube":
      return "bg-red-500 text-white"
    case "linkedin":
      return "bg-blue-700 text-white"
    default:
      return "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
  }
}
