"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { HttpTypes } from "@medusajs/types"

interface FilterSidebarProps {
  categories: HttpTypes.StoreProductCategory[]
  activeCategory?: string
  className?: string
}

export function FilterSidebar({ categories, activeCategory, className }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedPriceMax = searchParams.get("price_max") ?? ""

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111] mb-3 uppercase tracking-wider">Category</h3>
        <ul className="space-y-1">
          <li>
            <a
              href="/shop"
              className={cn("block py-1.5 px-2 rounded text-sm hover:bg-gray-50 transition-colors", !activeCategory && "font-semibold text-[#111111]")}
            >
              All Products
            </a>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <a
                href={`/shop/${cat.handle}`}
                className={cn(
                  "block py-1.5 px-2 rounded text-sm hover:bg-gray-50 transition-colors",
                  activeCategory === cat.handle ? "font-semibold text-[#111111]" : "text-gray-600"
                )}
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111] mb-3 uppercase tracking-wider">Max Price</h3>
        <div className="space-y-2">
          {["25", "50", "100", "200"].map(price => (
            <label key={price} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price_max"
                value={price}
                checked={selectedPriceMax === price}
                onChange={() => applyFilter("price_max", price)}
                className="accent-[#111111]"
              />
              <span className="text-sm text-gray-600">Under ${price}</span>
            </label>
          ))}
          {selectedPriceMax && (
            <button
              onClick={() => applyFilter("price_max", null)}
              className="text-xs text-[#999999] hover:text-[#111111] mt-1"
            >
              Clear price filter
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
