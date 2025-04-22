"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getCurrentUser, isAdmin } from "@/app/actions/auth-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllUsers, getSystemStats, fixRedisKeyStructure } from "@/lib/redis-utils"

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [isFixing, setIsFixing] = useState(false)
  const [fixSuccess, setFixSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await getCurrentUser()
        const adminStatus = await isAdmin()

        if (!user) {
          router.push("/login")
          return
        }

        if (!adminStatus) {
          router.push("/dashboard")
          return
        }

        // Fetch users and stats
        await fetchData()
      } catch (err) {
        console.error("Error checking admin status:", err)
        setError("Failed to verify admin status")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  async function fetchData() {
    try {
      // Get all users
      const allUsers = await getAllUsers()
      setUsers(allUsers)

      // Get system stats
      const systemStats = await getSystemStats()
      setStats(systemStats)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch admin data")
    }
  }

  async function handleFixRedisStructure() {
    try {
      setIsFixing(true)
      const success = await fixRedisKeyStructure()

      if (success) {
        setFixSuccess("Redis key structure fixed successfully")
        // Refresh data
        await fetchData()
      } else {
        setError("Failed to fix Redis key structure")
      }
    } catch (err) {
      console.error("Error fixing Redis key structure:", err)
      setError("Failed to fix Redis key structure")
    } finally {
      setIsFixing(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading admin panel...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Panel" text="Manage users, links, and platform settings." />

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fixSuccess && (
        <Alert className="my-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <AlertDescription className="text-green-800 dark:text-green-300">{fixSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </div>
          <Button onClick={handleFixRedisStructure} disabled={isFixing}>
            {isFixing ? "Fixing..." : "Fix Redis Structure"}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
