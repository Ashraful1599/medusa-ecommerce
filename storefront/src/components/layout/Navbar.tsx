import Link from "next/link"
import { Search, User } from "lucide-react"
import { sdk } from "@/lib/medusa"
import { MobileMenu } from "./MobileMenu"
import { CartIcon } from "./CartIcon"

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 10 })
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
          <Link href="/" className="font-black text-xl tracking-tight text-[#111111]">
            SHOPX
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Shop</Link>
            {categories.slice(0, 5).map((cat) => (
              <Link key={cat.id} href={`/shop/${cat.handle}`} className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">
                {cat.name}
              </Link>
            ))}
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">Blog</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 text-gray-600 hover:text-[#111111] transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
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
