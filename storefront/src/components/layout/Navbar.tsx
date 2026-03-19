import { User } from "lucide-react"
import Link from "next/link"
import { sdk } from "@/lib/medusa"
import { MobileMenu } from "./MobileMenu"
import { CartIcon } from "./CartIcon"
import { NavSearchBar } from "./NavSearchBar"
import { MegaMenu } from "./MegaMenu"
import { PagesDropdown } from "./PagesDropdown"
import { Logo } from "@/components/ui/Logo"

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 20, include_descendants_tree: true } as any)
    return product_categories
  } catch (err) {
    console.error("[Navbar] Failed to fetch categories:", err)
    return []
  }
}

export async function Navbar() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo variant="dark" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Home</Link>
            <MegaMenu categories={categories} />
            <PagesDropdown />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NavSearchBar />
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#111111] transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <CartIcon />
            {/* Mobile hamburger */}
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
