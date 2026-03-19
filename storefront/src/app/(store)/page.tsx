import type { Metadata } from "next"
import { HeroSlider } from "@/components/home/HeroSlider"
import { TrustBar } from "@/components/home/TrustBar"
import { CategoryCards } from "@/components/home/CategoryCards"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { SaleBanner } from "@/components/home/SaleBanner"
import { NewArrivals } from "@/components/home/NewArrivals"
import { NewsletterBlock } from "@/components/home/NewsletterBlock"
import { sdk } from "@/lib/medusa"

export const metadata: Metadata = {
  title: { absolute: "Nexly — Shop Everything" },
  description: "Fashion, medicine, electronics, home goods and more. Free shipping on orders over $50.",
}

async function getFeaturedProducts() {
  try {
    const { products } = await sdk.store.product.list({
      limit: 8,
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID,
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
      <HeroSlider />
      <TrustBar />
      <CategoryCards />
      <FeaturedProducts products={products} currencyCode="usd" />
      <SaleBanner />
      <NewArrivals />
      <NewsletterBlock />
    </>
  )
}
