"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Package, User, MapPin, LogOut } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { customer, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/auth/login")
    }
  }, [isLoading, customer, router])

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/login")
  }

  if (isLoading || !customer) {
    return null
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Top nav */}
        <aside className="md:w-56 flex-shrink-0">
          {/* Mobile: horizontal scrollable nav */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#F0C040] text-[#111111]"
                      : "text-[#111111] hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Sign out — below nav on md+, inline on mobile */}
          <div className="hidden md:block mt-4 pt-4 border-t border-[#E5E5E5]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>

          {/* Mobile: sign out inline */}
          <div className="md:hidden mt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 whitespace-nowrap transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </Container>
  )
}
