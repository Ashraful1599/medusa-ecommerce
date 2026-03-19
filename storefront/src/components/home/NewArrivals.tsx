import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"
import { Sparkles } from "lucide-react"

async function getNewArrivals() {
  try {
    const { products } = await sdk.store.product.list({
      limit: 4,
      order: "-created_at",
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID,
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    } as any)
    return products
  } catch {
    return []
  }
}

export async function NewArrivals() {
  const products = await getNewArrivals()
  if (products.length === 0) return null

  return (
    <Container>
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#F0C040]" />
            <h2 className="text-xl font-bold text-[#111111]">New Arrivals</h2>
          </div>
          <Link href="/shop?sort=created_at_desc">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product: HttpTypes.StoreProduct) => (
            <ProductCard key={product.id} product={product} currencyCode="usd" badge="New" />
          ))}
        </div>
      </section>
    </Container>
  )
}
