"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { themeOptions } from "@/lib/themes"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "personal", name: "Personal" },
    { id: "business", name: "Business" },
    { id: "creator", name: "Creator" },
    { id: "portfolio", name: "Portfolio" },
    { id: "minimal", name: "Minimal" },
  ]

  const filteredThemes = themeOptions.filter((theme) => {
    if (searchQuery && !theme.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (category !== "all") {
      // This is a simplified example - in a real app, themes would have categories
      if (category === "minimal" && theme.id !== "minimal") return false
      if (category === "personal" && !["default", "dark", "gradient-purple"].includes(theme.id)) return false
      if (category === "business" && !["minimal", "default", "dark"].includes(theme.id)) return false
      if (category === "creator" && !["neon", "gradient-purple", "gradient-blue"].includes(theme.id)) return false
      if (category === "portfolio" && !["retro", "nature", "minimal"].includes(theme.id)) return false
    }
    return true
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Templates Gallery"
        text="Browse and choose from our professionally designed templates."
      />

      <div className="mt-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs py-1.5">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        {filteredThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-muted-foreground mt-1 mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setCategory("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <Card key={theme.id} className="overflow-hidden group relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className={`h-full ${theme.backgroundCSS} p-4 flex items-center justify-center`}>
                    <div
                      className={`w-[160px] ${
                        theme.id === "minimal"
                          ? "border border-gray-200 dark:border-gray-700"
                          : theme.id === "neon"
                            ? "border-2 border-green-400"
                            : theme.id === "retro"
                              ? "bg-amber-100 border-2 border-amber-800"
                              : "bg-white/10 backdrop-blur-sm"
                      } ${
                        theme.id === "neon" ? "rounded-none" : theme.id === "nature" ? "rounded-full" : "rounded-xl"
                      } p-4 flex flex-col items-center gap-3`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${
                          theme.id === "minimal"
                            ? "bg-gray-100 dark:bg-gray-800"
                            : theme.id === "neon"
                              ? "bg-green-400/20"
                              : theme.id === "retro"
                                ? "bg-amber-200"
                                : "bg-white/20"
                        }`}
                      ></div>
                      <div
                        className={`w-full h-3 ${
                          theme.id === "neon" || theme.id === "minimal" ? "rounded-none" : "rounded-full"
                        } ${
                          theme.id === "minimal"
                            ? "bg-gray-100 dark:bg-gray-800"
                            : theme.id === "neon"
                              ? "bg-green-400/20"
                              : theme.id === "retro"
                                ? "bg-amber-200"
                                : "bg-white/20"
                        }`}
                      ></div>
                      <div
                        className={`w-3/4 h-2 ${
                          theme.id === "neon" || theme.id === "minimal" ? "rounded-none" : "rounded-full"
                        } ${
                          theme.id === "minimal"
                            ? "bg-gray-100 dark:bg-gray-800"
                            : theme.id === "neon"
                              ? "bg-green-400/20"
                              : theme.id === "retro"
                                ? "bg-amber-200"
                                : "bg-white/20"
                        }`}
                      ></div>
                      <div
                        className={`w-full h-8 ${
                          theme.id === "neon" || theme.id === "minimal" ? "rounded-none" : "rounded-md"
                        } ${
                          theme.id === "minimal"
                            ? "bg-transparent border border-gray-200 dark:border-gray-700"
                            : theme.id === "neon"
                              ? "bg-green-400/20 border border-green-400"
                              : theme.id === "retro"
                                ? "bg-amber-800"
                                : theme.id === "nature"
                                  ? "bg-amber-200"
                                  : "bg-white/20"
                        } mt-2`}
                      ></div>
                      <div
                        className={`w-full h-8 ${
                          theme.id === "neon" || theme.id === "minimal" ? "rounded-none" : "rounded-md"
                        } ${
                          theme.id === "minimal"
                            ? "bg-transparent border border-gray-200 dark:border-gray-700"
                            : theme.id === "neon"
                              ? "bg-green-400/20 border border-green-400"
                              : theme.id === "retro"
                                ? "bg-amber-800"
                                : theme.id === "nature"
                                  ? "bg-amber-200"
                                  : "bg-white/20"
                        }`}
                      ></div>
                      <div
                        className={`w-full h-8 ${
                          theme.id === "neon" || theme.id === "minimal" ? "rounded-none" : "rounded-md"
                        } ${
                          theme.id === "minimal"
                            ? "bg-transparent border border-gray-200 dark:border-gray-700"
                            : theme.id === "neon"
                              ? "bg-green-400/20 border border-green-400"
                              : theme.id === "retro"
                                ? "bg-amber-800"
                                : theme.id === "nature"
                                  ? "bg-amber-200"
                                  : "bg-white/20"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button asChild variant="secondary">
                      <Link href={`/editor?theme=${theme.id}`}>Use Template</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white"
                    >
                      <Link href={`/preview/${theme.id}`} target="_blank">
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
