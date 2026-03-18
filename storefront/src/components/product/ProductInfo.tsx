"use client"
import { useState } from "react"
import { Heart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { VariantSelector } from "./VariantSelector"
import { QuantitySelector } from "./QuantitySelector"
import { AddToCartButton } from "./AddToCartButton"
import { ImageGallery } from "./ImageGallery"
import { useWishlist } from "@/providers/wishlist-provider"
import type { HttpTypes } from "@medusajs/types"

interface ProductInfoProps {
  product: HttpTypes.StoreProduct
  currencyCode?: string
}

export function ProductInfo({ product, currencyCode = "usd" }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.length === 1 ? (product.variants[0].id ?? null) : null
  )
  const [quantity, setQuantity] = useState(1)
  const { toggle, isWishlisted } = useWishlist()

  const wishlisted = isWishlisted(product.id ?? "")

  // Get images — primary + variant images, deduplicated
  const images = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images?.map(img => img.url).filter(Boolean) ?? []),
  ].filter((url, i, arr) => arr.indexOf(url) === i) as string[]

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId)
  // calculated_price is a computed field — use type assertion as Medusa types may be incomplete
  const price = (selectedVariant as any)?.calculated_price?.calculated_amount ?? null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery */}
      <ImageGallery images={images.length > 0 ? images : []} title={product.title ?? ""} />

      {/* Product info */}
      <div>
        {product.collection && (
          <p className="text-sm text-[#999999] mb-1">{product.collection.title}</p>
        )}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] leading-tight">{product.title}</h1>
          <button
            onClick={() => toggle(product.id ?? "")}
            className="p-2 rounded-full border border-[#E5E5E5] hover:border-[#111111] transition-colors shrink-0"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} />
          </button>
        </div>

        {price !== null ? (
          <p className="text-2xl font-bold text-[#111111] mb-6">{formatPrice(price, currencyCode)}</p>
        ) : (
          <p className="text-lg text-[#999999] mb-6">Select a variant for pricing</p>
        )}

        {/* Variants */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="mb-6">
            <VariantSelector
              product={product}
              selectedVariantId={selectedVariantId}
              onVariantChange={setSelectedVariantId}
            />
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#111111] mb-2">Quantity</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        {/* Add to Cart */}
        <AddToCartButton variantId={selectedVariantId} quantity={quantity} />

        {/* Short description */}
        {product.description && (
          <p className="mt-6 text-sm text-gray-600 leading-relaxed line-clamp-3">{product.description}</p>
        )}
      </div>
    </div>
  )
}
