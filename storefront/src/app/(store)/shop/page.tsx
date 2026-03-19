import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { SortSelect } from "@/components/shop/SortSelect"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Pagination } from "@/components/shop/Pagination"
import { FilterChips } from "@/components/shop/FilterChips"
import { MobileFiltersButton } from "@/components/shop/MobileFiltersButton"
import { sdk } from "@/lib/medusa"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of fashion, electronics, home goods, and more.",
}

const LIMIT = 16

type SearchParams = { [key: string]: string | string[] | undefined }

function getParam(params: SearchParams, key: string): string | undefined {
  const v = params[key]
  return typeof v === "string" ? v : undefined
}

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 20 })
    return product_categories
  } catch {
    return []
  }
}

function getProductPrice(product: { variants?: { calculated_price?: { calculated_amount?: number | null } | null }[] }): number {
  const amounts = product.variants
    ?.flatMap(v => v.calculated_price ? [v.calculated_price.calculated_amount ?? 0] : []) ?? []
  return amounts.length ? Math.min(...amounts) : 0
}

async function getProducts(searchParams: SearchParams) {
  const page     = Math.max(1, Number(getParam(searchParams, "page")) || 1)
  const sort     = getParam(searchParams, "sort")
  const priceMax = getParam(searchParams, "price_max")
  const q        = getParam(searchParams, "q")

  // Price filter/sort can't be done via Medusa API — fetch all and apply manually
  const needsClientSort = sort === "price_asc" || sort === "price_desc"
  const needsClientFilter = !!priceMax

  try {
    const query: Record<string, unknown> = {
      limit: needsClientSort || needsClientFilter ? 200 : LIMIT,
      offset: needsClientSort || needsClientFilter ? 0 : (page - 1) * LIMIT,
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID,
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    }

    if (sort === "created_at_desc") query.order = "-created_at"
    if (sort === "title_asc")       query.order = "title"
    if (q) query.q = q

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { products, count: apiCount } = await (sdk.store.product.list as any)(query)

    // Client-side price filter
    if (priceMax) {
      const max = Number(priceMax)
      products = products.filter((p: Parameters<typeof getProductPrice>[0]) => {
        const price = getProductPrice(p)
        return price > 0 && price <= max
      })
    }

    // Client-side price sort
    if (sort === "price_asc") {
      products = [...products].sort((a: Parameters<typeof getProductPrice>[0], b: Parameters<typeof getProductPrice>[0]) => getProductPrice(a) - getProductPrice(b))
    } else if (sort === "price_desc") {
      products = [...products].sort((a: Parameters<typeof getProductPrice>[0], b: Parameters<typeof getProductPrice>[0]) => getProductPrice(b) - getProductPrice(a))
    }

    // Use filtered length as count when doing client-side work, otherwise use API count
    const count = (needsClientSort || needsClientFilter) ? products.length : (apiCount ?? 0)

    // Manual pagination when we fetched everything
    if (needsClientSort || needsClientFilter) {
      const offset = (page - 1) * LIMIT
      products = products.slice(offset, offset + LIMIT)
    }

    return { products, count, page }
  } catch {
    return { products: [], count: 0, page: 1 }
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const [categories, { products, count, page }] = await Promise.all([
    getCategories(),
    getProducts(params),
  ])

  const totalPages = Math.ceil(count / LIMIT)

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">
          All Products <span className="text-sm font-normal text-[#999999] ml-2">({count})</span>
        </h1>
        <div className="flex items-center gap-2">
          <MobileFiltersButton categories={categories} />
          <SortSelect value={getParam(params, "sort")} />
        </div>
      </div>
      <FilterChips />
      <div className="flex gap-8">
        <FilterSidebar categories={categories} className="hidden lg:block w-56 shrink-0" />
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
          <Pagination currentPage={page} totalPages={totalPages} basePath="/shop" searchParams={params as Record<string, string>} />
        </div>
      </div>
    </Container>
  )
}
