"use client"
import { useEffect } from "react"
import { X } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"
import { FilterSidebar } from "@/components/shop/FilterSidebar"

interface MobileFilterDrawerProps {
  categories: HttpTypes.StoreProductCategory[]
  activeCategory?: string
  isOpen: boolean
  onClose: () => void
}

export function MobileFilterDrawer({
  categories,
  activeCategory,
  isOpen,
  onClose,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5] shrink-0">
          <h2 className="text-base font-semibold text-[#111111]">Filters</h2>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 text-gray-600 hover:text-[#111111]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — only anchor (navigation) clicks close the drawer, not radio inputs */}
        <div
          className="flex-1 overflow-y-auto p-4"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) onClose()
          }}
        >
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  )
}
