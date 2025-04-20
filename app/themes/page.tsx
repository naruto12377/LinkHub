"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themeOptions, getThemeById, getButtonStyle } from "@/lib/themes"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import Image from "next/image"
import Link from "next/link"

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState("default")

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)
  }

  const currentTheme = getThemeById(selectedTheme)

  const demoLinks = [
    { id: "1", title: "My Website", type: "website", isPublic: true },
    { id: "2", title: "Instagram", type: "instagram", isPublic: true },
    { id: "3", title: "YouTube Channel", type: "youtube", isPublic: true },
    { id: "4", title: "Premium Content", type: "website", isPublic: false },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Theme Gallery" text="Explore and preview all available themes for your profile." />

      <div className="grid gap-8 md:grid-cols-[1fr_300px] mt-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Themes</CardTitle>
              <CardDescription>Select a theme to preview it</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{currentTheme.name}</CardTitle>
              <CardDescription>{currentTheme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Background Type</h3>
                  <p className="text-sm text-muted-foreground capitalize">{currentTheme.backgroundType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Font Family</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {currentTheme.fontFamily.replace("font-", "")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Button Style</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {currentTheme.buttonStyle.replace("rounded-", "")}
                  </p>
                </div>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/editor">Apply This Theme</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-4 self-start">
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
          <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl">
            <div className={`absolute inset-0 overflow-auto ${currentTheme.backgroundCSS}`}>
              <div className={`flex flex-col items-center p-6 pt-10 text-center ${currentTheme.colors.text}`}>
                <div className={`h-24 w-24 overflow-hidden rounded-full border-4 ${currentTheme.colors.accent}`}>
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className={`mt-4 text-xl font-bold ${currentTheme.fontFamily} ${currentTheme.colors.primary}`}>
                  @username
                </h3>
                <p className={`text-sm ${currentTheme.colors.secondary}`}>Digital Creator & Influencer</p>
                <div className="mt-6 grid w-full gap-4">
                  {demoLinks.map((link) => (
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
                          <span
                            className={`ml-2 h-4 w-4 ${
                              currentTheme.id === "default" ? "text-gray-500 dark:text-gray-400" : "text-gray-400"
                            }`}
                          >
                            🔒
                          </span>
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
    </DashboardShell>
  )
}
