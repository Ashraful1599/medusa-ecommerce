import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { SortSelect } from "@/components/shop/SortSelect"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Pagination } from "@/components/shop/Pagination"
import { FilterChips } from "@/components/shop/FilterChips"
import { sdk } from "@/lib/medusa"

export const metadata: Metadata = {
  title: "Shop All Products - SHOPX",
  description: "Browse our full collection of fashion, medicine, electronics, home goods, and sports items.",
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

async function getProducts(searchParams: SearchParams) {
  const page = Math.max(1, Number(getParam(searchParams, "page")) || 1)
  const offset = (page - 1) * LIMIT

  try {
    const query: Record<string, unknown> = {
      limit: LIMIT,
      offset,
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    }

    const sort = getParam(searchParams, "sort")
    if (sort === "price_asc") query.order = "variants.calculated_price.calculated_amount"
    if (sort === "price_desc") query.order = "-variants.calculated_price.calculated_amount"
    if (sort === "created_at_desc") query.order = "-created_at"
    if (sort === "title_asc") query.order = "title"

    const q = getParam(searchParams, "q")
    if (q) query.q = q

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { products, count } = await (sdk.store.product.list as any)(query)
    return { products, count: count ?? 0, page }
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
        <SortSelect value={getParam(params, "sort")} />
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
