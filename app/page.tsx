import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Users, Lock, DollarSign, BarChart3 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">LinkHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your Links, Your Way
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create beautiful mobile-friendly landing pages that showcase all your important links in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button className="px-8">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to create, share, and monetize your online presence
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <Smartphone className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Mobile-First Design</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Optimized for mobile devices with responsive layouts that look great on any screen size.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lock className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Privacy Controls</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Set links as public, private, or subscription-only with robust security features.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Monetization</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Charge for premium content, exclusive links, or special services directly through your profile.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <Users className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Community Features</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Create groups, build communities, and engage with followers all in one place.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Analytics</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Track engagement, monitor link clicks, and optimize your profile with detailed insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
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
                      className="h-5 w-5"
                    >
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      <path d="M12 2v2" />
                      <path d="M12 22v-2" />
                      <path d="m17 20.66-1-1.73" />
                      <path d="M11 10.27 7 3.34" />
                      <path d="m20.66 17-1.73-1" />
                      <path d="m3.34 7 1.73 1" />
                      <path d="M14 12h8" />
                      <path d="M2 12h2" />
                      <path d="m20.66 7-1.73 1" />
                      <path d="m3.34 17 1.73-1" />
                      <path d="m17 3.34-1 1.73" />
                      <path d="m7 20.66 1-1.73" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Customization</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Personalize your profile with themes, templates, and drag-and-drop design tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Showcase Your Content</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Create beautiful landing pages that showcase all your important links, content, and services in one
                    place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="px-8">Create Your Profile</Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-xl">
                  <div className="absolute inset-0 overflow-auto bg-white">
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
                      <h3 className="mt-4 text-xl font-bold">@username</h3>
                      <p className="text-sm text-gray-500">Digital Creator & Influencer</p>
                      <div className="mt-6 grid w-full gap-4">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-primary p-3 font-medium text-primary-foreground"
                        >
                          My Website
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-blue-500 p-3 font-medium text-white"
                        >
                          Instagram
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-green-500 p-3 font-medium text-white"
                        >
                          WhatsApp Community
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-red-500 p-3 font-medium text-white"
                        >
                          YouTube Channel
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-blue-700 p-3 font-medium text-white"
                        >
                          LinkedIn Profile
                        </a>
                        <div className="flex items-center justify-center rounded-md bg-gray-100 p-3 font-medium">
                          <span className="text-gray-500">Premium Content</span>
                          <Lock className="ml-2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-[27px] left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 LinkHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
