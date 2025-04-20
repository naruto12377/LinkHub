"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  ImageIcon,
  Save,
  Eye,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUserLinks, addLink, updateUserLink, deleteUserLink, updateLinkPositions } from "@/app/actions/link-actions"
import { getUserProfile, updateUserProfile, uploadUserProfileImage } from "@/app/actions/profile-actions"
import { themeOptions, getThemeById, getButtonStyle } from "@/lib/themes"
import type { User } from "@/lib/auth"
import type { Link as LinkType } from "@/lib/links"
import type { Profile } from "@/lib/profiles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

export default function EditorPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("default")

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const userData = await getCurrentUser()
        if (!userData) {
          router.push("/login")
          return
        }
        setUser(userData)

        // Get user links
        const linksResult = await getUserLinks()
        if (linksResult.success) {
          setLinks(linksResult.links.sort((a, b) => a.position - b.position))
        }

        // Get user profile
        const profileResult = await getUserProfile(userData.username)
        if (profileResult.success) {
          setProfile(profileResult.profile)
          setSelectedTheme(profileResult.profile.theme || "default")
        }
      } catch (err) {
        console.error("Error loading editor data:", err)
        setError("Failed to load editor data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }))

    setLinks(updatedItems)

    // Save new positions to database
    updateLinkPositions(updatedItems.map((item) => ({ id: item.id, position: item.position }))).catch((err) => {
      console.error("Error updating link positions:", err)
      setError("Failed to update link positions")
    })
  }

  const handleAddLink = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", "New Link")
    formData.append("url", "https://")
    formData.append("type", "website")
    formData.append("isPublic", "true")

    try {
      setIsSaving(true)
      const result = await addLink(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setLinks([...links, result.link])
        setSuccess("Link added successfully")
      }
    } catch (err) {
      console.error("Error adding link:", err)
      setError("Failed to add link")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateLink = async (link: LinkType, field: string, value: any) => {
    const updatedLink = { ...link, [field]: value }

    // Update link in state
    setLinks(links.map((l) => (l.id === link.id ? updatedLink : l)))

    // Save to database
    const formData = new FormData()
    formData.append("id", link.id)
    formData.append("title", updatedLink.title)
    formData.append("url", updatedLink.url)
    formData.append("type", updatedLink.type)
    formData.append("isPublic", updatedLink.isPublic.toString())

    try {
      const result = await updateUserLink(formData)

      if (result.error) {
        setError(result.error)
        // Revert changes if update failed
        setLinks(links)
      }
    } catch (err) {
      console.error("Error updating link:", err)
      setError("Failed to update link")
      // Revert changes if update failed
      setLinks(links)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      setIsSaving(true)

      const formData = new FormData()
      formData.append("id", linkId)

      const result = await deleteUserLink(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setLinks(links.filter((link) => link.id !== linkId))
        setSuccess("Link deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting link:", err)
      setError("Failed to delete link")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleLinkVisibility = (link: LinkType) => {
    handleUpdateLink(link, "isPublic", !link.isPublic)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!profile) return

    const form = e.target
    const formData = new FormData(form)

    try {
      setIsSaving(true)

      // First upload image if there is one
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("image", imageFile)

        const imageResult = await uploadUserProfileImage(imageFormData)

        if (imageResult.error) {
          setError(imageResult.error)
          setIsSaving(false)
          return
        }
      }

      // Then update profile
      const result = await updateUserProfile(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setProfile(result.profile)
        setSuccess("Profile updated successfully")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)
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

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading editor...</h2>
            <p className="text-muted-foreground">Please wait while we load your data</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const currentTheme = getThemeById(selectedTheme)

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Your Profile" text="Customize your profile and manage your links.">
        <Button asChild variant="outline">
          <Link href={`/profile/${user?.username}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
      </DashboardHeader>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="my-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <AlertDescription className="text-green-800 dark:text-green-300">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_300px] mt-6">
        <div className="space-y-6">
          <Tabs defaultValue="links">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">Your Links</h2>
                <Button onClick={handleAddLink} disabled={isSaving}>
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {links.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-10">
                            <Globe className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No links yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Add your first link to start building your profile
                            </p>
                            <Button onClick={handleAddLink} disabled={isSaving}>
                              <Plus className="mr-2 h-4 w-4" /> Add Link
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        links.map((link, index) => (
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
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleToggleLinkVisibility(link)}
                                      >
                                        {link.isPublic ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteLink(link.id)}
                                        disabled={isSaving}
                                      >
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
                                        onChange={(e) => handleUpdateLink(link, "title", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`url-${link.id}`}>URL</Label>
                                      <Input
                                        id={`url-${link.id}`}
                                        value={link.url}
                                        onChange={(e) => handleUpdateLink(link, "url", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`type-${link.id}`}>Link Type</Label>
                                      <Select
                                        value={link.type}
                                        onValueChange={(value) => handleUpdateLink(link, "type", value)}
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
                                        onCheckedChange={() => handleToggleLinkVisibility(link)}
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
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        defaultValue={profile?.displayName || user?.username}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" defaultValue={profile?.bio || ""} className="resize-none" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full border">
                          <Image
                            src={imagePreview || profile?.profileImage || "/placeholder.svg?height=64&width=64"}
                            width={64}
                            height={64}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-sm"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Upload Image
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Theme</h2>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Profile Theme</Label>
                      <Select name="theme" value={selectedTheme} onValueChange={handleThemeChange}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {themeOptions.map((theme) => (
                            <SelectItem key={theme.id} value={theme.id}>
                              {theme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{getThemeById(selectedTheme).description}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {themeOptions.map((theme) => (
                        <div
                          key={theme.id}
                          className={`cursor-pointer rounded-md border p-2 transition-all ${
                            selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleThemeChange(theme.id)}
                        >
                          <div className={`h-20 rounded ${theme.backgroundCSS}`}></div>
                          <p className="mt-2 text-center text-xs font-medium">{theme.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Button Customization</h2>
                    <div className="space-y-2">
                      <Label htmlFor="buttonStyle">Button Style</Label>
                      <Select name="buttonStyle" defaultValue={profile?.customization?.buttonStyle || "default"}>
                        <SelectTrigger id="buttonStyle">
                          <SelectValue placeholder="Select button style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buttonShape">Button Shape</Label>
                      <Select name="buttonShape" defaultValue={profile?.customization?.buttonShape || "rounded"}>
                        <SelectTrigger id="buttonShape">
                          <SelectValue placeholder="Select button shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="showLinkIcons">Show Link Icons</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showLinkIcons"
                          name="showLinkIcons"
                          defaultChecked={profile?.customization?.showLinkIcons !== false}
                        />
                        <Label htmlFor="showLinkIcons">Display icons next to links</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Layout Options</h2>
                    <div className="space-y-2">
                      <Label htmlFor="profileLayout">Profile Layout</Label>
                      <Select name="profileLayout" defaultValue={profile?.customization?.profileLayout || "standard"}>
                        <SelectTrigger id="profileLayout">
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="centered">Centered</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="showProfileStats">Show Profile Stats</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showProfileStats"
                          name="showProfileStats"
                          defaultChecked={profile?.customization?.showProfileStats === true}
                        />
                        <Label htmlFor="showProfileStats">Display view count on profile</Label>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky top-4 self-start">
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
          <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl">
            <div className={`absolute inset-0 overflow-auto ${currentTheme.backgroundCSS}`}>
              <div className={`flex flex-col items-center p-6 pt-10 text-center ${currentTheme.colors.text}`}>
                <div className={`h-24 w-24 overflow-hidden rounded-full border-4 ${currentTheme.colors.accent}`}>
                  <Image
                    src={imagePreview || profile?.profileImage || "/placeholder.svg?height=96&width=96"}
                    width={96}
                    height={96}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className={`mt-4 text-xl font-bold ${currentTheme.fontFamily} ${currentTheme.colors.primary}`}>
                  @{user?.username}
                </h3>
                <p className={`text-sm ${currentTheme.colors.secondary}`}>{profile?.bio || "Your bio here"}</p>
                <div className="mt-6 grid w-full gap-4">
                  {links.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">Add links to see them here</div>
                  ) : (
                    links
                      .sort((a, b) => a.position - b.position)
                      .map((link) => (
                        <div key={link.id}>
                          {link.isPublic ? (
                            <div
                              className={`flex items-center justify-center p-3 font-medium ${getButtonStyle(
                                currentTheme,
                                link.type,
                                link.isPublic,
                              )}`}
                            >
                              {link.title}
                            </div>
                          ) : (
                            <div
                              className={`flex items-center justify-center rounded-md ${
                                currentTheme.id === "default" ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-800/50"
                              } p-3 font-medium`}
                            >
                              <span
                                className={
                                  currentTheme.id === "default" ? "text-gray-500 dark:text-gray-400" : "text-gray-400"
                                }
                              >
                                {link.title}
                              </span>
                              <Lock
                                className={`ml-2 h-4 w-4 ${
                                  currentTheme.id === "default" ? "text-gray-500 dark:text-gray-400" : "text-gray-400"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
            <div className="absolute bottom-[27px] left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-gray-900" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
