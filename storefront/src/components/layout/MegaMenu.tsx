"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import {
  Shirt, Laptop, Home, Dumbbell, HeartPulse,
  ChevronDown, ArrowRight, ShoppingBag, Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { HttpTypes } from "@medusajs/types"

// ── Category config ───────────────────────────────────────────────────────────

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
      { label: "Furniture",    href: "/shop/home-living" },
      { label: "Kitchen",      href: "/shop/home-living" },
      { label: "Bedding",      href: "/shop/home-living" },
      { label: "Lighting",     href: "/shop/home-living" },
      { label: "Storage",      href: "/shop/home-living" },
      { label: "Decor",        href: "/shop/home-living" },
    ],
  },
  sports: {
    icon: Dumbbell,
    subLinks: [
      { label: "Fitness",      href: "/shop/sports" },
      { label: "Outdoor",      href: "/shop/sports" },
      { label: "Team Sports",  href: "/shop/sports" },
      { label: "Yoga",         href: "/shop/sports" },
      { label: "Cycling",      href: "/shop/sports" },
      { label: "Swimming",     href: "/shop/sports" },
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

// ── Component ─────────────────────────────────────────────────────────────────

interface MegaMenuProps {
  categories: HttpTypes.StoreProductCategory[]
}

export function MegaMenu({ categories }: MegaMenuProps) {
  const [open, setOpen]               = useState(false)
  const [visible, setVisible]         = useState(false)
  const [mounted, setMounted]         = useState(false)
  const [activeHandle, setActiveHandle] = useState<string | null>(
    categories[0]?.handle ?? null
  )
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    function onClickOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    if (open) document.addEventListener("mousedown", onClickOutside)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [open])

  function handleClose() { setOpen(false) }

  const activeConfig = CATEGORY_CONFIG[activeHandle ?? ""]
  const activeCategory = categories.find(c => c.handle === activeHandle)

  // ── Panel ──────────────────────────────────────────────────────────────────
  const panel = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 top-[100px] z-40 bg-black/10 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Mega panel */}
      <div
        role="navigation"
        aria-label="Shop categories"
        style={{ transition: "opacity 200ms ease, transform 200ms ease" }}
        className={`fixed top-[100px] left-0 right-0 z-50 bg-white border-t-2 border-t-[#F0C040] shadow-2xl ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >

        <div className="max-w-[1280px] mx-auto flex">

          {/* ── Left: category sidebar ── */}
          <div className="w-52 shrink-0 border-r border-[#F0F0F0] py-6">
            <p className="px-5 mb-3 text-[10px] font-bold tracking-widest text-[#999999] uppercase">
              Categories
            </p>
            {categories.map(cat => {
              const config = CATEGORY_CONFIG[cat.handle ?? ""]
              const Icon = config?.icon ?? ShoppingBag
              const isActive = cat.handle === activeHandle

              return (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.handle}`}
                  onClick={handleClose}
                  onMouseEnter={() => setActiveHandle(cat.handle ?? null)}
                  className={cn(
                    "group flex items-center gap-3 px-5 py-2.5 transition-all relative",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F0C040]",
                    isActive
                      ? "text-[#111111] bg-[#FAFAFA]"
                      : "text-[#666666] hover:text-[#111111] hover:bg-[#FAFAFA]"
                  )}
                >
                  {/* Active left border */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#F0C040] rounded-full" />
                  )}
                  <span className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                    isActive ? "bg-[#F0C040]" : "bg-[#F5F5F5] group-hover:bg-[#F0C040]"
                  )}>
                    <Icon className="h-3.5 w-3.5 text-[#111111]" />
                  </span>
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "font-semibold text-[#111111]" : ""
                  )}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <ArrowRight className="h-3.5 w-3.5 ml-auto text-[#111111]" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Center: sub-links for active category ── */}
          <div className="flex-1 py-6 px-8 border-r border-[#F0F0F0]">
            {activeCategory && (
              <>
                <p className="mb-4 text-[10px] font-bold tracking-widest text-[#999999] uppercase">
                  {activeCategory.name}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {(activeConfig?.subLinks ?? []).map(sub => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={handleClose}
                      className={cn(
                        "group flex items-center gap-2 py-2 text-sm text-[#555555]",
                        "hover:text-[#111111] transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0C040] rounded"
                      )}
                    >
                      <span className="w-1 h-1 rounded-full bg-[#CCCCCC] group-hover:bg-[#111111] transition-colors shrink-0" />
                      <span>{sub.label}</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Right: promo panel ── */}
          <div className="w-56 shrink-0 py-6 px-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#F0C040]" />
                <p className="text-[10px] font-bold tracking-widest text-[#F0C040] uppercase">
                  New In
                </p>
              </div>
              <p className="text-[#111111] font-bold text-base leading-snug mb-2">
                Fresh Arrivals
              </p>
              <p className="text-[#999999] text-xs leading-relaxed">
                The latest drops across every category, updated weekly.
              </p>
              <p className="mt-3 text-xs font-bold text-[#111111]">
                500+ new products
              </p>
            </div>
            <Link
              href="/shop"
              onClick={handleClose}
              className={cn(
                "mt-6 flex items-center justify-center gap-2",
                "bg-[#111111] text-white text-xs font-bold px-4 py-2.5 rounded-lg",
                "hover:bg-[#333333] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0C040]"
              )}
            >
              Shop Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#F0F0F0]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <p className="text-xs text-[#999999]">
              Free shipping on orders over{" "}
              <span className="font-semibold text-[#111111]">$50</span>
            </p>
            <Link
              href="/shop"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#F0C040] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0C040] rounded"
            >
              Browse all products <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div ref={triggerRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0C040] rounded",
          open ? "text-[#111111] font-semibold" : "text-gray-600 hover:text-[#111111]"
        )}
      >
        Shop
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted && createPortal(panel, document.body)}
    </div>
  )
}
