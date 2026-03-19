import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

export interface MeilisearchProductHit {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  price: number
  currency_code: string
}

interface SearchResultsProps {
  hits: MeilisearchProductHit[]
}

export function SearchResults({ hits }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {hits.map((hit) => (
        <Link
          key={hit.id}
          href={`/products/${hit.handle}`}
          className="group border border-[#E5E5E5] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-square relative bg-gray-100">
            {hit.thumbnail ? (
              <Image
                src={hit.thumbnail}
                alt={hit.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 group-hover:text-[#F0C040] transition-colors">
              {hit.title}
            </h3>
            {hit.price != null && (
              <p className="mt-1 text-sm font-bold text-[#111111]">
                {formatPrice(hit.price, hit.currency_code ?? "usd")}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
