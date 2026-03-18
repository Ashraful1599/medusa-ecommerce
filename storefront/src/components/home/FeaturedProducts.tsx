import { ProductCard } from "@/components/ui/ProductCard"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import type { HttpTypes } from "@medusajs/types"

interface FeaturedProductsProps {
  products: HttpTypes.StoreProduct[]
  currencyCode?: string
}

export function FeaturedProducts({ products, currencyCode = "usd" }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <Container>
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#111111]">Featured Products</h2>
          <Link href="/shop"><Button variant="ghost" size="sm">View All</Button></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} currencyCode={currencyCode} />
          ))}
        </div>
      </section>
    </Container>
  )
}
