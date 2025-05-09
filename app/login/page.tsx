"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Layout } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        // Redirect to dashboard on successful login
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1 rounded-md">
                <Layout className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">LinkHub</span>
            </div>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                placeholder="username or email@example.com"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link className="text-sm underline text-primary" href="#">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" required type="password" autoComplete="current-password" />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="underline text-primary" href="/signup">
                Sign up
              </Link>
            </div>
          </form>

          {/* Admin login hint - remove in production */}
          <div className="mt-8 rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800">
            <p className="font-medium">Admin Login:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
