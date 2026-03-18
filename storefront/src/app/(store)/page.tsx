import type { Metadata } from "next"
import { HeroBanner } from "@/components/home/HeroBanner"
import { CategoryStrip } from "@/components/home/CategoryStrip"
import { PromoBanner } from "@/components/home/PromoBanner"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { sdk } from "@/lib/medusa"

export const metadata: Metadata = {
  title: "SHOPX - Shop Everything",
  description: "Fashion, medicine, electronics, home goods and more. Free shipping on orders over $50.",
}

async function getFeaturedProducts() {
  try {
    const { products } = await sdk.store.product.list({
      limit: 8,
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    } as any)
    return products
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <>
      <PromoBanner />
      <HeroBanner />
      <CategoryStrip />
      <FeaturedProducts products={products} currencyCode="usd" />
    </>
  )
}
