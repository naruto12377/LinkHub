import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Globe, Layout, Lock, Smartphone, Sparkles, Users } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1 rounded-md">
                <Layout className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">LinkHub</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:text-primary" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#templates">
              Templates
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:text-primary" href="#resources">
              Resources
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Log in
              </Link>
              <Button asChild>
                <Link href="/signup">Sign up free</Link>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
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
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    LINKHUB PAGES
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Landing pages that turn visits into conversions
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Showcase your content, products, and services on a customizable, no-code landing page. Track
                    engagement and drive conversions with captivating landing pages.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Get started for free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#templates">View templates</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
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
                      className="h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Free plan available</span>
                  </div>
                  <div className="flex items-center gap-1">
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
                      className="h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>No credit card required</span>
                  </div>
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

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  FEATURES
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Create, share, and monetize your online presence with our powerful platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Mobile-First Design</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Optimized for mobile devices with responsive layouts that look great on any screen size.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Beautiful Templates</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose from dozens of professionally designed templates to make your page stand out.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Detailed Analytics</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Track engagement, monitor link clicks, and optimize your profile with detailed insights.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Privacy Controls</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Set links as public, private, or subscription-only with robust security features.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Community Features</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Create groups, build communities, and engage with followers all in one place.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Custom Domains</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Use your own domain name for a professional and branded experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="templates" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  TEMPLATES
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Style</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start with a professionally designed template and customize it to match your brand
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Template 1 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-purple-500 to-pink-500 p-4 flex items-center justify-center">
                    <div className="w-[160px] bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20"></div>
                      <div className="w-full h-3 rounded-full bg-white/20"></div>
                      <div className="w-3/4 h-2 rounded-full bg-white/20"></div>
                      <div className="w-full h-8 rounded-md bg-white/20 mt-2"></div>
                      <div className="w-full h-8 rounded-md bg-white/20"></div>
                      <div className="w-full h-8 rounded-md bg-white/20"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Purple Gradient</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vibrant and modern design</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              {/* Template 2 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-blue-500 to-teal-400 p-4 flex items-center justify-center">
                    <div className="w-[160px] bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20"></div>
                      <div className="w-full h-3 rounded-full bg-white/20"></div>
                      <div className="w-3/4 h-2 rounded-full bg-white/20"></div>
                      <div className="w-full h-8 rounded-md bg-white/20 mt-2"></div>
                      <div className="w-full h-8 rounded-md bg-white/20"></div>
                      <div className="w-full h-8 rounded-md bg-white/20"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Ocean Blue</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calming blue gradient</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              {/* Template 3 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-black p-4 flex items-center justify-center">
                    <div className="w-[160px] border-2 border-green-400 rounded-none p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-400/20"></div>
                      <div className="w-full h-3 rounded-none bg-green-400/20"></div>
                      <div className="w-3/4 h-2 rounded-none bg-green-400/20"></div>
                      <div className="w-full h-8 rounded-none bg-green-400/20 mt-2 border border-green-400"></div>
                      <div className="w-full h-8 rounded-none bg-green-400/20 border border-green-400"></div>
                      <div className="w-full h-8 rounded-none bg-green-400/20 border border-green-400"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Neon</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vibrant neon theme with dark background</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              {/* Template 4 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-gray-50 p-4 flex items-center justify-center">
                    <div className="w-[160px] border border-gray-200 rounded-none p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100"></div>
                      <div className="w-full h-3 rounded-none bg-gray-100"></div>
                      <div className="w-3/4 h-2 rounded-none bg-gray-100"></div>
                      <div className="w-full h-8 rounded-none bg-transparent mt-2 border border-gray-200"></div>
                      <div className="w-full h-8 rounded-none bg-transparent border border-gray-200"></div>
                      <div className="w-full h-8 rounded-none bg-transparent border border-gray-200"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Minimal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ultra-minimal design with focus on content</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              {/* Template 5 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-amber-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-4 flex items-center justify-center">
                    <div className="w-[160px] bg-amber-100 border-2 border-amber-800 rounded-md p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-200"></div>
                      <div className="w-full h-3 rounded-md bg-amber-200"></div>
                      <div className="w-3/4 h-2 rounded-md bg-amber-200"></div>
                      <div className="w-full h-8 rounded-md bg-amber-800 mt-2 text-amber-50"></div>
                      <div className="w-full h-8 rounded-md bg-amber-800 text-amber-50"></div>
                      <div className="w-full h-8 rounded-md bg-amber-800 text-amber-50"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Retro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vintage-inspired design</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              {/* Template 6 */}
              <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-green-800 to-green-600 p-4 flex items-center justify-center">
                    <div className="w-[160px] bg-white/10 backdrop-blur-sm rounded-full p-4 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20"></div>
                      <div className="w-full h-3 rounded-full bg-white/20"></div>
                      <div className="w-3/4 h-2 rounded-full bg-white/20"></div>
                      <div className="w-full h-8 rounded-full bg-amber-200 mt-2 text-green-900"></div>
                      <div className="w-full h-8 rounded-full bg-amber-200 text-green-900"></div>
                      <div className="w-full h-8 rounded-full bg-amber-200 text-green-900"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">Nature</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earthy tones inspired by nature</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary">Use Template</Button>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    View all templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  PRICING
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that's right for you
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-gray-500 dark:text-gray-400">Perfect for getting started</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Up to 5 links</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-red-500"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="text-gray-500">Custom domain</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-red-500"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="text-gray-500">Premium templates</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                </ul>
                <Button className="mt-8" size="lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col rounded-lg border-2 border-primary bg-white p-6 shadow-sm dark:bg-gray-950">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    POPULAR
                  </div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-gray-500 dark:text-gray-400">For creators and professionals</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Unlimited links</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="mt-8" size="lg" variant="default" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Business Plan */}
              <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Business</h3>
                  <p className="text-gray-500 dark:text-gray-400">For teams and businesses</p>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Team management</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>White labeling</span>
                  </li>
                  <li className="flex items-center">
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
                      className="mr-2 h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button className="mt-8" size="lg" variant="outline" asChild>
                  <Link href="/signup">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    GET STARTED TODAY
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Create Your LinkHub Page in Minutes
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                    Join thousands of creators, influencers, and businesses who use LinkHub to connect with their
                    audience and drive conversions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Sign up free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Sparkles className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No credit card required</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Get started with our free plan and upgrade when you're ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white dark:bg-gray-950 border-t">
        <div className="container px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white p-1 rounded-md">
                  <Layout className="h-6 w-6" />
                </div>
                <span className="font-bold text-xl">LinkHub</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Create beautiful landing pages that showcase all your important links in one place.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <p className="text-center text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} LinkHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
