import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Home, LinkIcon, LogOut, Settings, User } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="font-bold">LinkHub</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/johndoe">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[200px] flex-col border-r md:flex">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/editor"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LinkIcon className="h-4 w-4" />
              Links
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
