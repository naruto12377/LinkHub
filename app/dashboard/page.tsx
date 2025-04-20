"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Edit, Eye, LinkIcon, Plus, Settings } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUserLinks } from "@/app/actions/link-actions"
import { getUserProfile, getAnalytics } from "@/app/actions/profile-actions"
import type { User } from "@/lib/auth"
import type { Link as LinkType } from "@/lib/links"
import type { Profile } from "@/lib/profiles"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          setLinks(linksResult.links)
        }

        // Get user profile
        const profileResult = await getUserProfile(userData.username)
        if (profileResult.success) {
          setProfile(profileResult.profile)
        }

        // Get analytics
        const analyticsResult = await getAnalytics()
        if (analyticsResult.success) {
          setAnalytics(analyticsResult.analytics)
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we load your data</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.displayName || user?.username || "User"}`}
        text="Manage your profile, links, and analytics."
      />

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.views || 0}</div>
                <p className="text-xs text-muted-foreground">Lifetime profile views</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.reduce((total, link) => total + (link.clicks || 0), 0)}</div>
                <p className="text-xs text-muted-foreground">Total clicks across all links</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.length}</div>
                <p className="text-xs text-muted-foreground">Links on your profile</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button asChild>
                  <Link href="/editor">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/profile/${user?.username}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    View Public Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Links</CardTitle>
                <CardDescription>Your most clicked links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No links yet. Add your first link!</p>
                  ) : (
                    links
                      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                      .slice(0, 3)
                      .map((link) => (
                        <div key={link.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{link.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
                          </div>
                          <div className="text-sm font-medium">{link.clicks || 0} clicks</div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed statistics about your profile and links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                {analytics ? (
                  <div className="w-full p-4">
                    <h3 className="text-lg font-medium mb-4">Profile Views by Day</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries(analytics.viewsByDay || {}).map(([date, count]) => (
                        <div key={date} className="flex flex-col items-center">
                          <div
                            className="bg-primary w-full"
                            style={{
                              height: `${Math.max(20, Math.min(150, (count as number) * 10))}px`,
                            }}
                          ></div>
                          <span className="text-xs mt-1">
                            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span className="text-xs font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No analytics data available yet</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Link</CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">
                      {links.length > 0
                        ? links.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0].title
                        : "No links yet"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {links.length > 0
                        ? `${links.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0].clicks || 0} clicks`
                        : "Add your first link"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">
                      {profile && profile.views > 0 && links.length > 0
                        ? `${Math.round((links.reduce((total, link) => total + (link.clicks || 0), 0) / profile.views) * 100)}%`
                        : "0%"}
                    </div>
                    <p className="text-xs text-muted-foreground">Clicks / Views</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Public Links</CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{links.filter((link) => link.isPublic).length}</div>
                    <p className="text-xs text-muted-foreground">Out of {links.length} total links</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Premium Links</CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{links.filter((link) => !link.isPublic).length}</div>
                    <p className="text-xs text-muted-foreground">Premium/private links</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
            <Button asChild>
              <Link href="/editor">
                <Plus className="mr-2 h-4 w-4" /> Manage Links
              </Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {links.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <LinkIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No links yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first link to start building your profile
                  </p>
                  <Button asChild>
                    <Link href="/editor">
                      <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              links.map((link) => (
                <Card key={link.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription className="truncate max-w-[300px]">{link.url}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/editor">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {link.clicks || 0} clicks • {link.isPublic ? "Public" : "Premium"}
                    </div>
                    <div className="text-sm text-muted-foreground">Type: {link.type}</div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={user?.displayName || user?.username} disabled />
                <p className="text-xs text-muted-foreground">You can change your display name in the profile editor</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user?.username} disabled />
                <p className="text-xs text-muted-foreground">Your username cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email} disabled />
                <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
              </div>
              <Button asChild>
                <Link href="/editor">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
