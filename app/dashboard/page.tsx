"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Edit, Eye, LinkIcon, Plus, Settings, Sparkles, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUserLinks } from "@/app/actions/link-actions"
import { getUserProfile, getAnalytics } from "@/app/actions/profile-actions"
import type { User } from "@/lib/auth"
import type { Link as LinkType } from "@/lib/links"
import type { Profile } from "@/lib/profiles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
      >
        <Button asChild>
          <Link href="/editor">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Link>
        </Button>
      </DashboardHeader>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile && profile.views > 0 && links.length > 0
                ? `${Math.round((links.reduce((total, link) => total + (link.clicks || 0), 0) / profile.views) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Clicks / Views</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your LinkHub Pages</h2>
          <Button asChild>
            <Link href="/editor">
              <Plus className="mr-2 h-4 w-4" /> Create New Page
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b bg-muted/50 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input placeholder="Search pages..." className="h-9 w-[200px] md:w-[300px] lg:w-[400px]" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Page</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Created</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Views</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Clicks</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {links.length === 0 ? (
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td colSpan={6} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Sparkles className="h-8 w-8 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No pages yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Create your first LinkHub page to start sharing your links
                          </p>
                          <Button asChild>
                            <Link href="/editor">
                              <Plus className="mr-2 h-4 w-4" /> Create New Page
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    links.map((link) => (
                      <tr
                        key={link.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 pl-6 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <LinkIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {new Date(link.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4 align-middle">{profile?.views || 0}</td>
                        <td className="p-4 align-middle">{link.clicks || 0}</td>
                        <td className="p-4 align-middle">
                          <Badge variant={link.isPublic ? "default" : "outline"}>
                            {link.isPublic ? "Public" : "Private"}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/profile/${user?.username}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href="/editor">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
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
      </div>
    </DashboardShell>
  )
}
