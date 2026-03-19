import { AuthTabs } from "@/components/auth/AuthTabs"

export const metadata = {
  title: "Sign In",
  description: "Sign in or create a new Nexly account.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-sm p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
            Welcome to Nexly
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your account or create a new one.
          </p>
        </div>
        <AuthTabs />
      </div>
    </div>
  )
}
