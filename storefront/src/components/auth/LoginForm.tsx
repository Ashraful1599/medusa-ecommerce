"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/Button"

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    try {
      await login(email, password)
      router.push("/account/orders")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password."
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <p aria-live="polite" className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-sm">{errorMessage}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-[#E5E5E5] rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-[#E5E5E5] rounded-sm px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#111111]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
        Sign In
      </Button>
    </form>
  )
}
