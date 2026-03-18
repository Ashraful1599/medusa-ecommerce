import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { sdk } from "@/lib/medusa"
import { Shirt, Pill, Laptop, Home, Dumbbell, ShoppingBag } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"

// Map category handles to lucide icons
function getCategoryIcon(handle: string) {
  const map: Record<string, React.ReactNode> = {
    fashion: <Shirt className="h-6 w-6" />,
    medicine: <Pill className="h-6 w-6" />,
    electronics: <Laptop className="h-6 w-6" />,
    "home-living": <Home className="h-6 w-6" />,
    sports: <Dumbbell className="h-6 w-6" />,
  }
  return map[handle] ?? <ShoppingBag className="h-6 w-6" />
}

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 10 })
    return product_categories
  } catch {
    return []
  }
}

export async function CategoryStrip() {
  const categories = await getCategories()

  if (categories.length === 0) return null

  return (
    <Container>
      <section className="py-12">
        <h2 className="text-xl font-bold text-[#111111] mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
          {categories.map((cat: HttpTypes.StoreProductCategory) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.handle}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E5E5E5] hover:border-[#111111] hover:shadow-sm transition-all group"
            >
              <div className="text-[#999999] group-hover:text-[#111111] transition-colors">
                {getCategoryIcon(cat.handle ?? "")}
              </div>
              <span className="text-xs font-medium text-[#111111] text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  )
}
