"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Container } from "@/components/layout/Container"
import { ProductCard } from "@/components/ui/ProductCard"
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton"
import { useWishlist } from "@/providers/wishlist-provider"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

export default function WishlistPage() {
  const { wishlistIds } = useWishlist()

  const { data, isLoading } = useQuery<HttpTypes.StoreProduct[]>({
    queryKey: ["wishlist-products", wishlistIds.join(",")],
    queryFn: async () => {
      // id[] filter not exposed in SDK types — cast only the params object
      const { products } = await sdk.store.product.list(
        { id: wishlistIds, fields: "id,title,handle,thumbnail,collection.title,variants.id,variants.calculated_price" } as Parameters<typeof sdk.store.product.list>[0]
      )
      return products ?? []
    },
    enabled: wishlistIds.length > 0,
  })

  const products: HttpTypes.StoreProduct[] = data ?? []

  // Empty state
  if (wishlistIds.length === 0) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
          <Heart className="h-16 w-16 text-[#E5E5E5]" />
          <h1 className="text-2xl font-bold text-[#111111]">Your wishlist is empty</h1>
          <p className="text-[#999999] max-w-sm">
            Save your favourite items here to revisit them later.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-block bg-[#111111] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#333333] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-2">
        <Heart className="h-6 w-6 text-[#111111] fill-current" />
        <h1 className="text-2xl font-bold text-[#111111]">My Wishlist</h1>
      </div>
      <p className="text-sm text-[#999999] mb-6">
        {wishlistIds.length} {wishlistIds.length === 1 ? "item" : "items"} in your wishlist
      </p>

      {/* Loading state */}
      {isLoading ? (
        <ProductGridSkeleton count={wishlistIds.length > 8 ? 8 : wishlistIds.length} />
      ) : products.length === 0 ? (
        // All products removed from backend
        <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
          <Heart className="h-12 w-12 text-[#E5E5E5]" />
          <p className="text-[#999999]">Some wishlisted products are no longer available.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#111111] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#333333] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} currencyCode="usd" />
          ))}
        </div>
      )}
    </Container>
  )
}
