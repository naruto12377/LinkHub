"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  MessageCircle,
  Lock,
  Unlock,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function EditorPage() {
  const [links, setLinks] = useState([
    {
      id: "1",
      title: "My Website",
      url: "https://example.com",
      type: "website",
      isPublic: true,
    },
    {
      id: "2",
      title: "Instagram",
      url: "https://instagram.com/username",
      type: "instagram",
      isPublic: true,
    },
    {
      id: "3",
      title: "WhatsApp Community",
      url: "https://whatsapp.com/group/link",
      type: "whatsapp",
      isPublic: true,
    },
  ])

  const [profile, setProfile] = useState({
    username: "johndoe",
    displayName: "John Doe",
    bio: "Digital Creator & Influencer",
    theme: "default",
  })

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setLinks(items)
  }

  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "New Link",
      url: "",
      type: "website",
      isPublic: true,
    }
    setLinks([...links, newLink])
  }

  const removeLink = (id) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const updateLink = (id, field, value) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const toggleLinkVisibility = (id) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, isPublic: !link.isPublic } : link)))
  }

  const getLinkIcon = (type) => {
    switch (type) {
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "whatsapp":
        return <MessageCircle className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Your Profile</h1>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Tabs defaultValue="links">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">Your Links</h2>
                <Button onClick={addLink}>
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {links.map((link, index) => (
                        <Draggable key={link.id} draggableId={link.id} index={index}>
                          {(provided) => (
                            <Card ref={provided.innerRef} {...provided.draggableProps} className="border">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div {...provided.dragHandleProps} className="flex items-center space-x-2">
                                    <div className="flex flex-col">
                                      <ArrowUp className="h-4 w-4" />
                                      <ArrowDown className="h-4 w-4" />
                                    </div>
                                    {getLinkIcon(link.type)}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => toggleLinkVisibility(link.id)}>
                                      {link.isPublic ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-4 space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`title-${link.id}`}>Title</Label>
                                    <Input
                                      id={`title-${link.id}`}
                                      value={link.title}
                                      onChange={(e) => updateLink(link.id, "title", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`url-${link.id}`}>URL</Label>
                                    <Input
                                      id={`url-${link.id}`}
                                      value={link.url}
                                      onChange={(e) => updateLink(link.id, "url", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`type-${link.id}`}>Link Type</Label>
                                    <Select
                                      value={link.type}
                                      onValueChange={(value) => updateLink(link.id, "type", value)}
                                    >
                                      <SelectTrigger id={`type-${link.id}`}>
                                        <SelectValue placeholder="Select link type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="website">Website</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id={`visibility-${link.id}`}
                                      checked={link.isPublic}
                                      onCheckedChange={() => toggleLinkVisibility(link.id)}
                                    />
                                    <Label htmlFor={`visibility-${link.id}`}>
                                      {link.isPublic ? "Public" : "Premium (Subscribers Only)"}
                                    </Label>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Theme</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      profile.theme === "default" ? "border-primary" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "default" })}
                  >
                    <div className="h-20 rounded bg-white"></div>
                    <p className="mt-2 text-center text-sm">Default</p>
                  </div>
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      profile.theme === "dark" ? "border-primary" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "dark" })}
                  >
                    <div className="h-20 rounded bg-gray-900"></div>
                    <p className="mt-2 text-center text-sm">Dark</p>
                  </div>
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${
                      profile.theme === "gradient" ? "border-primary" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "gradient" })}
                  >
                    <div className="h-20 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <p className="mt-2 text-center text-sm">Gradient</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="sticky top-4 self-start">
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
          <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl">
            <div
              className={`absolute inset-0 overflow-auto ${
                profile.theme === "dark"
                  ? "bg-gray-900 text-white"
                  : profile.theme === "gradient"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white"
              }`}
            >
              <div className="flex flex-col items-center p-6 pt-10 text-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-bold">@{profile.username}</h3>
                <p className={`text-sm ${profile.theme === "default" ? "text-gray-500" : "text-gray-200"}`}>
                  {profile.bio}
                </p>
                <div className="mt-6 grid w-full gap-4">
                  {links.map((link) => (
                    <div key={link.id}>
                      {link.isPublic ? (
                        <div
                          className={`flex items-center justify-center rounded-md p-3 font-medium ${getLinkStyle(
                            link.type,
                            profile.theme,
                          )}`}
                        >
                          {link.title}
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-center rounded-md ${
                            profile.theme === "default" ? "bg-gray-100" : "bg-gray-800"
                          } p-3 font-medium`}
                        >
                          <span className={profile.theme === "default" ? "text-gray-500" : "text-gray-400"}>
                            {link.title}
                          </span>
                          <Lock
                            className={`ml-2 h-4 w-4 ${
                              profile.theme === "default" ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-[27px] left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-gray-900" />
          </div>
        </div>
      </div>
    </div>
  )
}

function getLinkStyle(type: string, theme: string): string {
  if (theme === "dark") {
    switch (type) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "website":
        return "bg-blue-600 text-white"
      case "whatsapp":
        return "bg-green-600 text-white"
      case "youtube":
        return "bg-red-600 text-white"
      case "linkedin":
        return "bg-blue-700 text-white"
      default:
        return "bg-gray-700 text-white"
    }
  } else if (theme === "gradient") {
    switch (type) {
      case "instagram":
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
      case "website":
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
      case "whatsapp":
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
      case "youtube":
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
      case "linkedin":
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
      default:
        return "bg-white/20 backdrop-blur-sm text-white border border-white/30"
    }
  } else {
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
        return "bg-gray-100 text-gray-900"
    }
  }
}
