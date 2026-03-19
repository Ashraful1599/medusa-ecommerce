import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/Container"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"
import { ArrowRight } from "lucide-react"

const CATEGORY_IMAGES: Record<string, string> = {
  fashion:      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
  electronics:  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
  "home-living": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  sports:       "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  medicine:     "https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80",
}

const CATEGORY_COLORS: Record<string, string> = {
  fashion:       "from-rose-900/70",
  electronics:   "from-blue-900/70",
  "home-living": "from-amber-900/70",
  sports:        "from-green-900/70",
  medicine:      "from-teal-900/70",
}

async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({ limit: 10 })
    return product_categories
  } catch {
    return []
  }
}

export async function CategoryCards() {
  const categories = await getCategories()
  if (categories.length === 0) return null

  return (
    <Container>
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#111111]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat: HttpTypes.StoreProductCategory) => {
            const image = CATEGORY_IMAGES[cat.handle ?? ""]
            const gradient = CATEGORY_COLORS[cat.handle ?? ""] ?? "from-gray-900/70"

            return (
              <Link
                key={cat.id}
                href={`/shop/${cat.handle}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100"
              >
                {/* Background image */}
                {image ? (
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200" />
                )}

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`} />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight mb-1">{cat.name}</p>
                  <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                    Shop now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </Container>
  )
}
