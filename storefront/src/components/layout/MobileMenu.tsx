"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"

export function MobileMenu({ categories }: { categories: HttpTypes.StoreProductCategory[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden p-2 text-gray-600 hover:text-[#111111]"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
          <Link href="/" className="font-black text-xl tracking-tight" onClick={() => setOpen(false)}>SHOPX</Link>
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { href: "/", label: "Home" },
            { href: "/shop", label: "Shop" },
            { href: "/blog", label: "Blog" },
            { href: "/account", label: "Account" },
            { href: "/search", label: "Search" },
            { href: "/cart", label: "Cart" },
            { href: "/wishlist", label: "Wishlist" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#111111]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {categories.length > 0 && (
            <>
              <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.handle}`}
                  className="block py-2.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </>
  )
}
