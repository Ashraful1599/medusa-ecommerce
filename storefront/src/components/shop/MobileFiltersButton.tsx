"use client"
import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer"

interface MobileFiltersButtonProps {
  categories: HttpTypes.StoreProductCategory[]
  activeCategory?: string
}

export function MobileFiltersButton({
  categories,
  activeCategory,
}: MobileFiltersButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 border border-[#E5E5E5] rounded text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <MobileFilterDrawer
        categories={categories}
        activeCategory={activeCategory}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}
