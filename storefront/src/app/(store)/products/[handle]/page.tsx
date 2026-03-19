import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductTabs } from "@/components/product/ProductTabs"
import { sdk } from "@/lib/medusa"

type Params = { handle: string }

async function getProduct(handle: string) {
  try {
    // sdk.store.product.list types may be incomplete — using any for field-level query support
    const { products } = await (sdk.store.product.list as any)({
      handle,
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID,
      fields: "id,title,handle,description,thumbnail,images.id,images.url,collection.title,options.id,options.title,options.values.value,variants.id,variants.title,variants.options.option_id,variants.options.value,variants.calculated_price,variants.images.id,variants.images.url",
    })
    return products?.[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.title,
    description: product.description ?? `Buy ${product.title} at Nexly`,
    openGraph: {
      title: product.title,
      description: product.description ?? "",
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) notFound()

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.thumbnail,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8000"}/products/${handle}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.title },
          ]}
          className="mb-6"
        />
        <ProductInfo product={product} currencyCode="usd" />
        <ProductTabs description={product.description} productId={product.id} />
      </Container>
    </>
  )
}
