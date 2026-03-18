import { ProductCard } from "@/components/ui/ProductCard"
import { ShoppingBag } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  currencyCode?: string
}

export function ProductGrid({ products, currencyCode = "usd" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-[#111111] mb-2">No products found</h3>
        <p className="text-sm text-[#999999]">Try adjusting your filters or browse all products.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} currencyCode={currencyCode} />
      ))}
    </div>
  )
}
