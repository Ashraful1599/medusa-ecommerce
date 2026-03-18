import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { FilterSidebar } from "@/components/shop/FilterSidebar"
import { SortSelect } from "@/components/shop/SortSelect"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Pagination } from "@/components/shop/Pagination"
import { FilterChips } from "@/components/shop/FilterChips"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { sdk } from "@/lib/medusa"

const LIMIT = 16

type SearchParams = { [key: string]: string | string[] | undefined }
type Params = { category: string }

function getParam(params: SearchParams, key: string): string | undefined {
  const v = params[key]
  return typeof v === "string" ? v : undefined
}

async function getCategory(handle: string) {
  try {
    const { product_categories } = await sdk.store.category.list({ handle, limit: 1 })
    return product_categories[0] ?? null
  } catch {
    return null
  }
}

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 20 })
    return product_categories
  } catch {
    return []
  }
}

async function getProducts(categoryId: string, searchParams: SearchParams) {
  const page = Math.max(1, Number(getParam(searchParams, "page")) || 1)
  const offset = (page - 1) * LIMIT

  try {
    const query: Record<string, unknown> = {
      limit: LIMIT,
      offset,
      category_id: [categoryId],
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    }

    const sort = getParam(searchParams, "sort")
    if (sort === "price_asc") query.order = "variants.calculated_price.calculated_amount"
    if (sort === "price_desc") query.order = "-variants.calculated_price.calculated_amount"
    if (sort === "created_at_desc") query.order = "-created_at"
    if (sort === "title_asc") query.order = "title"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { products, count } = await (sdk.store.product.list as any)(query)
    return { products, count: count ?? 0, page }
  } catch {
    return { products: [], count: 0, page: 1 }
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategory(category)
  return {
    title: cat ? `${cat.name} - SHOPX` : "Shop - SHOPX",
    description: cat ? `Browse ${cat.name} products at SHOPX` : "Shop at SHOPX",
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const [{ category: handle }, spParams] = await Promise.all([params, searchParams])
  const [cat, categories, { products, count, page }] = await Promise.all([
    getCategory(handle),
    getCategories(),
    (async () => {
      const c = await getCategory(handle)
      if (!c) return { products: [], count: 0, page: 1 }
      return getProducts(c.id, spParams)
    })(),
  ])

  if (!cat) notFound()

  const totalPages = Math.ceil(count / LIMIT)

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: cat.name },
        ]}
        className="mb-6"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">
          {cat.name} <span className="text-sm font-normal text-[#999999] ml-2">({count})</span>
        </h1>
        <SortSelect value={getParam(spParams, "sort")} />
      </div>
      <FilterChips />
      <div className="flex gap-8">
        <FilterSidebar categories={categories} activeCategory={handle} className="hidden lg:block w-56 shrink-0" />
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/shop/${handle}`} searchParams={spParams as Record<string, string>} />
        </div>
      </div>
    </Container>
  )
}
