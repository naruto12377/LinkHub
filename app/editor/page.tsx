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
  ChevronDown,
  Palette,
  Smartphone,
  Monitor,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

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
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">("mobile")
  const [activeTab, setActiveTab] = useState("links")

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

  const handleProfileUpdate = async () => {
    if (!profile) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

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
      const formData = new FormData()

      // Get values from the form fields
      const displayNameInput = document.getElementById("displayName") as HTMLInputElement
      const bioTextarea = document.getElementById("bio") as HTMLTextAreaElement
      const themeSelect = document.querySelector("[name='theme']") as HTMLSelectElement
      const buttonStyleSelect = document.querySelector("[name='buttonStyle']") as HTMLSelectElement
      const fontFamilySelect = document.querySelector("[name='fontFamily']") as HTMLSelectElement

      // Append form values
      formData.append("displayName", displayNameInput?.value || profile.displayName)
      formData.append("bio", bioTextarea?.value || profile.bio)
      formData.append("theme", selectedTheme)

      // Append customization options
      if (buttonStyleSelect) formData.append("buttonStyle", buttonStyleSelect.value)
      if (fontFamilySelect) formData.append("fontFamily", fontFamilySelect.value)

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
      <DashboardHeader heading="Page Editor" text="Customize your profile and manage your links.">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/profile/${user?.username}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleProfileUpdate} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Publish"}
          </Button>
        </div>
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

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="w-full lg:w-[350px] space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Page Settings</h3>
              </div>

              <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="links">Links</TabsTrigger>
                  <TabsTrigger value="appearance">Design</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="links" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Your Links</h4>
                    <Button size="sm" onClick={handleAddLink} disabled={isSaving}>
                      <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="links">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {links.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-md">
                              <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                              <h3 className="text-sm font-medium">No links yet</h3>
                              <p className="text-xs text-muted-foreground mb-4 text-center">
                                Add your first link to start building your profile
                              </p>
                              <Button size="sm" onClick={handleAddLink} disabled={isSaving}>
                                <Plus className="mr-2 h-4 w-4" /> Add Link
                              </Button>
                            </div>
                          ) : (
                            links.map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="border rounded-md overflow-hidden"
                                  >
                                    <Accordion type="single" collapsible>
                                      <AccordionItem value={link.id} className="border-0">
                                        <div className="flex items-center justify-between p-3 bg-muted/50">
                                          <div {...provided.dragHandleProps} className="flex items-center gap-2 flex-1">
                                            <div className="flex flex-col">
                                              <ArrowUp className="h-3 w-3" />
                                              <ArrowDown className="h-3 w-3" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {getLinkIcon(link.type)}
                                              <span className="text-sm font-medium truncate max-w-[150px]">
                                                {link.title}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7"
                                              onClick={() => handleToggleLinkVisibility(link)}
                                            >
                                              {link.isPublic ? (
                                                <Unlock className="h-3.5 w-3.5" />
                                              ) : (
                                                <Lock className="h-3.5 w-3.5" />
                                              )}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7"
                                              onClick={() => handleDeleteLink(link.id)}
                                              disabled={isSaving}
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <AccordionTrigger className="h-7 w-7 p-0 hover:no-underline">
                                              <ChevronDown className="h-3.5 w-3.5" />
                                            </AccordionTrigger>
                                          </div>
                                        </div>
                                        <AccordionContent className="pt-0">
                                          <div className="p-3 space-y-3">
                                            <div className="space-y-2">
                                              <Label htmlFor={`title-${link.id}`} className="text-xs">
                                                Title
                                              </Label>
                                              <Input
                                                id={`title-${link.id}`}
                                                value={link.title}
                                                onChange={(e) => handleUpdateLink(link, "title", e.target.value)}
                                                className="h-8 text-sm"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor={`url-${link.id}`} className="text-xs">
                                                URL
                                              </Label>
                                              <Input
                                                id={`url-${link.id}`}
                                                value={link.url}
                                                onChange={(e) => handleUpdateLink(link, "url", e.target.value)}
                                                className="h-8 text-sm"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor={`type-${link.id}`} className="text-xs">
                                                Link Type
                                              </Label>
                                              <Select
                                                value={link.type}
                                                onValueChange={(value) => handleUpdateLink(link, "type", value)}
                                              >
                                                <SelectTrigger id={`type-${link.id}`} className="h-8 text-sm">
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
                                              <Label htmlFor={`visibility-${link.id}`} className="text-xs">
                                                {link.isPublic ? "Public" : "Premium (Subscribers Only)"}
                                              </Label>
                                            </div>
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  </div>
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

                <TabsContent value="appearance" className="space-y-6 mt-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Profile Information</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-xs">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          defaultValue={profile?.displayName || user?.username}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-xs">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          defaultValue={profile?.bio || ""}
                          className="resize-none text-sm min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profileImage" className="text-xs">
                          Profile Image
                        </Label>
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
                            className="cursor-pointer flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs"
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

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Theme</h4>
                      <div className="space-y-2">
                        <Label htmlFor="theme" className="text-xs">
                          Profile Theme
                        </Label>
                        <Select name="theme" value={selectedTheme} onValueChange={handleThemeChange}>
                          <SelectTrigger id="theme" className="h-8 text-sm">
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
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.slice(0, 6).map((theme) => (
                          <div
                            key={theme.id}
                            className={`cursor-pointer rounded-md border p-1 transition-all ${
                              selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => handleThemeChange(theme.id)}
                          >
                            <div className={`h-14 rounded ${theme.backgroundCSS}`}></div>
                            <p className="mt-1 text-center text-xs truncate">{theme.name}</p>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/themes">
                          <Palette className="mr-2 h-4 w-4" /> View All Themes
                        </Link>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Button Style</h4>
                      <div className="space-y-2">
                        <Label htmlFor="buttonStyle" className="text-xs">
                          Style
                        </Label>
                        <Select name="buttonStyle" defaultValue={profile?.customization?.buttonStyle || "default"}>
                          <SelectTrigger id="buttonStyle" className="h-8 text-sm">
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
                        <Label htmlFor="buttonShape" className="text-xs">
                          Shape
                        </Label>
                        <RadioGroup
                          defaultValue={profile?.customization?.buttonShape || "rounded"}
                          name="buttonShape"
                          className="flex gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rounded" id="rounded" />
                            <Label htmlFor="rounded" className="text-xs">
                              Rounded
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pill" id="pill" />
                            <Label htmlFor="pill" className="text-xs">
                              Pill
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="square" id="square" />
                            <Label htmlFor="square" className="text-xs">
                              Square
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="buttonSpacing" className="text-xs">
                            Button Spacing
                          </Label>
                          <span className="text-xs text-muted-foreground">16px</span>
                        </div>
                        <Slider defaultValue={[16]} max={32} step={4} className="w-full" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Typography</h4>
                      <div className="space-y-2">
                        <Label htmlFor="fontFamily" className="text-xs">
                          Font Family
                        </Label>
                        <Select name="fontFamily" defaultValue={profile?.customization?.fontFamily || "sans"}>
                          <SelectTrigger id="fontFamily" className="h-8 text-sm">
                            <SelectValue placeholder="Select font family" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sans">Sans Serif</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="mono">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="fontSize" className="text-xs">
                            Font Size
                          </Label>
                          <span className="text-xs text-muted-foreground">16px</span>
                        </div>
                        <Slider defaultValue={[16]} max={24} step={1} className="w-full" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Page Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle" className="text-xs">
                        Page Title
                      </Label>
                      <Input
                        id="pageTitle"
                        name="pageTitle"
                        defaultValue={`${user?.displayName || user?.username}'s Links`}
                        className="h-8 text-sm"
                      />
                      <p className="text-xs text-muted-foreground">This appears in browser tabs and search results</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pageUrl" className="text-xs">
                        Page URL
                      </Label>
                      <div className="flex items-center h-8 rounded-md border bg-muted px-3 text-xs">
                        <span className="text-muted-foreground">linkhub.com/</span>
                        <span>{user?.username}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <Button variant="link" className="h-auto p-0 text-xs" asChild>
                          <Link href="#">Upgrade to Pro</Link>
                        </Button>{" "}
                        to use a custom domain
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">SEO Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription" className="text-xs">
                        Meta Description
                      </Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        placeholder="A brief description of your page for search engines"
                        className="resize-none text-sm min-h-[80px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps search engines understand what your page is about
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Privacy</h4>
                    <div className="flex items-center space-x-2">
                      <Switch id="isPrivate" name="isPrivate" />
                      <Label htmlFor="isPrivate" className="text-xs">
                        Make page private
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, your page will only be visible to you when logged in
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Analytics</h4>
                    <div className="space-y-2">
                      <Label htmlFor="googleAnalytics" className="text-xs">
                        Google Analytics ID
                      </Label>
                      <Input
                        id="googleAnalytics"
                        name="googleAnalytics"
                        placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                        className="h-8 text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        <Button variant="link" className="h-auto p-0 text-xs" asChild>
                          <Link href="#">Upgrade to Pro</Link>
                        </Button>{" "}
                        to use custom analytics
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={activeDevice === "mobile" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setActiveDevice("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeDevice === "desktop" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setActiveDevice("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                {activeDevice === "mobile" ? (
                  <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl">
                    <div className={`absolute inset-0 overflow-auto ${currentTheme.backgroundCSS}`}>
                      <div className={`flex flex-col items-center p-6 pt-10 text-center ${currentTheme.colors.text}`}>
                        <div
                          className={`h-24 w-24 overflow-hidden rounded-full border-4 ${currentTheme.colors.accent}`}
                        >
                          <Image
                            src={imagePreview || profile?.profileImage || "/placeholder.svg?height=96&width=96"}
                            width={96}
                            height={96}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3
                          className={`mt-4 text-xl font-bold ${currentTheme.fontFamily} ${currentTheme.colors.primary}`}
                        >
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
                                        currentTheme.id === "default"
                                          ? "bg-gray-100 dark:bg-gray-800"
                                          : "bg-gray-800/50"
                                      } p-3 font-medium`}
                                    >
                                      <span
                                        className={
                                          currentTheme.id === "default"
                                            ? "text-gray-500 dark:text-gray-400"
                                            : "text-gray-400"
                                        }
                                      >
                                        {link.title}
                                      </span>
                                      <Lock
                                        className={`ml-2 h-4 w-4 ${
                                          currentTheme.id === "default"
                                            ? "text-gray-500 dark:text-gray-400"
                                            : "text-gray-400"
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
                  </div>
                ) : (
                  <div className="w-full max-w-2xl mx-auto">
                    <div
                      className={`rounded-lg border shadow-lg overflow-hidden ${currentTheme.backgroundCSS} ${currentTheme.colors.text}`}
                    >
                      <div className="flex flex-col items-center p-8 pt-12 text-center">
                        <div
                          className={`h-32 w-32 overflow-hidden rounded-full border-4 ${currentTheme.colors.accent}`}
                        >
                          <Image
                            src={imagePreview || profile?.profileImage || "/placeholder.svg?height=128&width=128"}
                            width={128}
                            height={128}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3
                          className={`mt-4 text-2xl font-bold ${currentTheme.fontFamily} ${currentTheme.colors.primary}`}
                        >
                          @{user?.username}
                        </h3>
                        <p className={`text-lg ${currentTheme.colors.secondary}`}>{profile?.bio || "Your bio here"}</p>
                        <div className="mt-8 grid w-full max-w-md gap-4 mx-auto">
                          {links.length === 0 ? (
                            <div className="text-center text-muted-foreground">Add links to see them here</div>
                          ) : (
                            links
                              .sort((a, b) => a.position - b.position)
                              .map((link) => (
                                <div key={link.id}>
                                  {link.isPublic ? (
                                    <div
                                      className={`flex items-center justify-center p-4 font-medium ${getButtonStyle(
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
                                        currentTheme.id === "default"
                                          ? "bg-gray-100 dark:bg-gray-800"
                                          : "bg-gray-800/50"
                                      } p-4 font-medium`}
                                    >
                                      <span
                                        className={
                                          currentTheme.id === "default"
                                            ? "text-gray-500 dark:text-gray-400"
                                            : "text-gray-400"
                                        }
                                      >
                                        {link.title}
                                      </span>
                                      <Lock
                                        className={`ml-2 h-4 w-4 ${
                                          currentTheme.id === "default"
                                            ? "text-gray-500 dark:text-gray-400"
                                            : "text-gray-400"
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
