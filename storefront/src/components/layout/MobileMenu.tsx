"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Menu, X, ChevronDown, ChevronRight,
  Shirt, Laptop, Home, Dumbbell, HeartPulse, ShoppingBag,
  BookOpen, Newspaper, HelpCircle, Phone,
} from "lucide-react"
import type { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/Logo"

// ── Shared config (mirrors MegaMenu) ──────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, {
  icon: React.ElementType
  subLinks: { label: string; href: string }[]
}> = {
  fashion: {
    icon: Shirt,
    subLinks: [
      { label: "Women's Clothing", href: "/shop/fashion" },
      { label: "Men's Clothing",   href: "/shop/fashion" },
      { label: "Accessories",      href: "/shop/fashion" },
      { label: "Footwear",         href: "/shop/fashion" },
      { label: "Bags & Purses",    href: "/shop/fashion" },
      { label: "Jewellery",        href: "/shop/fashion" },
    ],
  },
  electronics: {
    icon: Laptop,
    subLinks: [
      { label: "Phones & Tablets", href: "/shop/electronics" },
      { label: "Laptops",          href: "/shop/electronics" },
      { label: "Audio",            href: "/shop/electronics" },
      { label: "Cameras",          href: "/shop/electronics" },
      { label: "Smart Home",       href: "/shop/electronics" },
      { label: "Wearables",        href: "/shop/electronics" },
    ],
  },
  "home-living": {
    icon: Home,
    subLinks: [
      { label: "Furniture",  href: "/shop/home-living" },
      { label: "Kitchen",    href: "/shop/home-living" },
      { label: "Bedding",    href: "/shop/home-living" },
      { label: "Lighting",   href: "/shop/home-living" },
      { label: "Storage",    href: "/shop/home-living" },
      { label: "Decor",      href: "/shop/home-living" },
    ],
  },
  sports: {
    icon: Dumbbell,
    subLinks: [
      { label: "Fitness",     href: "/shop/sports" },
      { label: "Outdoor",     href: "/shop/sports" },
      { label: "Team Sports", href: "/shop/sports" },
      { label: "Yoga",        href: "/shop/sports" },
      { label: "Cycling",     href: "/shop/sports" },
      { label: "Swimming",    href: "/shop/sports" },
    ],
  },
  medicine: {
    icon: HeartPulse,
    subLinks: [
      { label: "Vitamins",      href: "/shop/medicine" },
      { label: "First Aid",     href: "/shop/medicine" },
      { label: "Personal Care", href: "/shop/medicine" },
      { label: "Supplements",   href: "/shop/medicine" },
      { label: "Skincare",      href: "/shop/medicine" },
      { label: "Baby Care",     href: "/shop/medicine" },
    ],
  },
}

const PAGES_ITEMS = [
  { label: "Blog",        href: "/blog",    icon: BookOpen,  badge: undefined },
  { label: "About Us",    href: "/about",   icon: Newspaper, badge: undefined },
  { label: "Help Center", href: "/help",    icon: HelpCircle, badge: undefined },
  { label: "Contact Us",  href: "/contact", icon: Phone,     badge: undefined },
]

// ── Accordion row ─────────────────────────────────────────────────────────────

function AccordionRow({
  label,
  open,
  onToggle,
  children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-sm font-semibold transition-colors",
          open ? "text-[#111111]" : "text-gray-700 hover:text-[#111111]"
        )}
      >
        {label}
        <ChevronDown
          className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && children}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileMenu({ categories }: { categories: HttpTypes.StoreProductCategory[] }) {
  const [open, setOpen]                   = useState(false)
  const [shopOpen, setShopOpen]           = useState(false)
  const [pagesOpen, setPagesOpen]         = useState(false)
  const [expandedCat, setExpandedCat]     = useState<string | null>(null)

  function close() {
    setOpen(false)
    setShopOpen(false)
    setPagesOpen(false)
    setExpandedCat(null)
  }

  return (
    <>
      {/* Hamburger trigger — mobile only */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-[#111111] transition-colors"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[min(320px,100vw)] bg-white z-50 flex flex-col",
          "transform transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#E5E5E5] shrink-0">
          <span onClick={close}><Logo variant="dark" /></span>
          <button
            onClick={close}
            aria-label="Close menu"
            className="p-2 text-gray-400 hover:text-[#111111] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <nav className="flex-1 overflow-y-auto divide-y divide-[#F0F0F0]">

          {/* Home */}
          <Link
            href="/"
            onClick={close}
            className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#111111] transition-colors"
          >
            Home
          </Link>

          {/* Shop accordion */}
          <AccordionRow label="Shop" open={shopOpen} onToggle={() => setShopOpen(v => !v)}>
            <div className="bg-[#FAFAFA] border-t border-[#F0F0F0]">

              {/* Category list */}
              {categories.map(cat => {
                const config     = CATEGORY_CONFIG[cat.handle ?? ""]
                const Icon       = config?.icon ?? ShoppingBag
                const isExpanded = expandedCat === cat.handle
                const hasLinks   = (config?.subLinks?.length ?? 0) > 0

                return (
                  <div key={cat.id} className="border-b border-[#F0F0F0] last:border-0">
                    {/* Category row */}
                    <div className="flex items-center">
                      <Link
                        href={`/shop/${cat.handle}`}
                        onClick={close}
                        className="flex items-center gap-3 flex-1 pl-6 pr-2 py-3 text-sm text-gray-700 hover:text-[#111111] transition-colors"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#F5F5F5]">
                          <Icon className="h-3.5 w-3.5 text-[#111111]" />
                        </span>
                        {cat.name}
                      </Link>
                      {hasLinks && (
                        <button
                          onClick={() => setExpandedCat(isExpanded ? null : (cat.handle ?? null))}
                          className="p-3 text-gray-400 hover:text-[#111111] transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronRight
                            className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")}
                          />
                        </button>
                      )}
                    </div>

                    {/* Sub-links */}
                    {isExpanded && config?.subLinks && (
                      <div className="bg-white pl-[52px] pr-4 pb-2 space-y-0.5">
                        {config.subLinks.map(sub => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={close}
                            className="flex items-center gap-2 py-1.5 text-sm text-[#666666] hover:text-[#111111] transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#CCCCCC] shrink-0" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Browse all */}
              <Link
                href="/shop"
                onClick={close}
                className="flex items-center gap-2 pl-6 pr-4 py-3 text-xs font-bold text-[#111111] hover:text-[#F0C040] transition-colors border-t border-[#F0F0F0]"
              >
                Browse all products
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AccordionRow>

          {/* Pages accordion */}
          <AccordionRow label="Pages" open={pagesOpen} onToggle={() => setPagesOpen(v => !v)}>
            <div className="bg-[#FAFAFA] border-t border-[#F0F0F0]">
              {PAGES_ITEMS.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className="flex items-center gap-3 pl-6 pr-4 py-3 text-sm text-gray-700 hover:text-[#111111] transition-colors border-b border-[#F0F0F0] last:border-0"
                  >
                    <Icon className="h-4 w-4 text-[#999999]" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-[#F0C040] text-[#111111] px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </AccordionRow>

          {/* Utility links */}
          <div className="py-1">
            {[
              { href: "/account",  label: "Account" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/search",   label: "Search" },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#111111] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] shrink-0">
          <p className="text-xs text-[#999999]">
            Free shipping on orders over <span className="font-semibold text-[#111111]">$50</span>
          </p>
        </div>
      </div>
    </>
  )
}
