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

  // All product images (thumbnail first), deduplicated
  const allProductImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images?.map(img => img.url).filter(Boolean) ?? []),
  ].filter((url, i, arr) => arr.indexOf(url) === i) as string[]

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId)

  // If the selected variant has its own images, show those; otherwise show all product images.
  const variantImages = (selectedVariant as any)?.images as Array<{ id: string; url: string }> | undefined
  const images = variantImages && variantImages.length > 0
    ? variantImages.map(img => img.url).filter(Boolean) as string[]
    : allProductImages

  // Find the index of the first image that's unique to this variant (not shared by all variants).
  // This lets the gallery jump straight to the color/style-specific photo instead of always index 0.
  const jumpToIndex = (() => {
    if (!variantImages || variantImages.length === 0) return 0
    // Build a set of URLs that appear in every variant's image list (shared images)
    const allVariantImageSets = (product.variants ?? []).map(v =>
      new Set(((v as any).images ?? []).map((i: any) => i.url as string))
    )
    const sharedUrls = new Set(
      images.filter(url => allVariantImageSets.every(set => set.has(url)))
    )
    const uniqueIdx = images.findIndex(url => !sharedUrls.has(url))
    return uniqueIdx >= 0 ? uniqueIdx : 0
  })()

  // calculated_price is a computed field — use type assertion as Medusa types may be incomplete
  const price = (selectedVariant as any)?.calculated_price?.calculated_amount ?? null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery */}
      <ImageGallery images={images.length > 0 ? images : []} title={product.title ?? ""} jumpToIndex={jumpToIndex} />

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
