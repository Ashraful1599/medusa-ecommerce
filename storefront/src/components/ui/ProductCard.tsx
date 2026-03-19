"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useCart } from "@/providers/cart-provider"
import { useWishlist } from "@/providers/wishlist-provider"
import { Button } from "@/components/ui/Button"
import type { HttpTypes } from "@medusajs/types"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  currencyCode?: string
  className?: string
  badge?: string
}

function getLowestPrice(product: HttpTypes.StoreProduct): number | null {
  const prices = product.variants
    ?.flatMap(v => v.calculated_price ? [v.calculated_price.calculated_amount ?? 0] : [])
  if (!prices || prices.length === 0) return null
  return Math.min(...prices)
}

export function ProductCard({ product, currencyCode = "usd", className, badge }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const price = getLowestPrice(product)
  const wishlisted = isWishlisted(product.id ?? "")
  const hasSingleVariant = (product.variants?.length ?? 0) === 1
  const singleVariantId = hasSingleVariant ? product.variants![0].id : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (singleVariantId) {
      await addItem(singleVariantId, 1)
    }
  }

  return (
    <div className={cn("group relative border border-[#E5E5E5] rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow", className)}>
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#F0C040] text-[#111111] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
          {badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.preventDefault(); toggle(product.id ?? "") }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} />
      </button>

      <Link href={`/products/${product.handle}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title ?? "Product image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.collection && (
            <p className="text-xs text-[#999999] mb-1 truncate">{product.collection.title}</p>
          )}
          <h3 className="text-sm font-semibold text-[#111111] leading-snug line-clamp-2 mb-2">{product.title}</h3>
          {price !== null && (
            <p className="text-sm font-bold text-[#111111]">{formatPrice(price, currencyCode)}</p>
          )}
        </div>
      </Link>

      {/* CTA */}
      <div className="px-4 pb-4">
        {hasSingleVariant ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        ) : (
          <Link href={`/products/${product.handle}`}>
            <Button variant="ghost" size="sm" className="w-full">
              Select Options
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
