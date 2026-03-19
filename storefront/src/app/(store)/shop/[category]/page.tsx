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

function getProductPrice(product: { variants?: { calculated_price?: { calculated_amount?: number | null } | null }[] }): number {
  const amounts = product.variants
    ?.flatMap(v => v.calculated_price ? [v.calculated_price.calculated_amount ?? 0] : []) ?? []
  return amounts.length ? Math.min(...amounts) : 0
}

async function getProducts(categoryId: string, searchParams: SearchParams) {
  const page     = Math.max(1, Number(getParam(searchParams, "page")) || 1)
  const sort     = getParam(searchParams, "sort")
  const priceMax = getParam(searchParams, "price_max")

  const needsClientSort   = sort === "price_asc" || sort === "price_desc"
  const needsClientFilter = !!priceMax

  try {
    const query: Record<string, unknown> = {
      limit: needsClientSort || needsClientFilter ? 200 : LIMIT,
      offset: needsClientSort || needsClientFilter ? 0 : (page - 1) * LIMIT,
      category_id: [categoryId],
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID,
      fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price",
    }

    if (sort === "created_at_desc") query.order = "-created_at"
    if (sort === "title_asc")       query.order = "title"

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

export async function generateStaticParams() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 100 })
    return product_categories.map((cat) => ({ category: cat.handle }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategory(category)
  return {
    title: cat ? cat.name : "Shop",
    description: cat
      ? `Browse ${cat.name} products at Nexly — fashion, electronics, home goods, and more.`
      : "Shop all products at Nexly.",
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
  const [cat, categories] = await Promise.all([getCategory(handle), getCategories()])
  const { products, count, page } = cat
    ? await getProducts(cat.id, spParams)
    : { products: [], count: 0, page: 1 }

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
