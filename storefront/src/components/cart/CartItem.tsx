"use client"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "@/providers/cart-provider"
import { formatPrice } from "@/lib/utils"
import type { HttpTypes } from "@medusajs/types"

export function CartItem({ item }: { item: HttpTypes.StoreCartLineItem }) {
  const { updateItem, removeItem } = useCart()

  const variantLabel = item.variant?.title && item.variant.title !== "Default" ? item.variant.title : null
  const unitPrice = item.unit_price ?? 0
  const lineTotal = unitPrice * item.quantity
  const currencyCode = item.cart?.currency_code ?? "usd"

  return (
    <div className="flex gap-4 py-5 border-b border-[#E5E5E5] last:border-0">
      {/* Thumbnail */}
      <div className="relative shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-50 border border-[#E5E5E5]">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.product_title ?? "Product"} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#111111] leading-snug truncate">{item.product_title}</p>
        {variantLabel && <p className="text-xs text-[#999999] mt-0.5">{variantLabel}</p>}
        <p className="text-sm font-bold text-[#111111] mt-1">{formatPrice(lineTotal, currencyCode)}</p>

        {/* Qty controls */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => {
              if (item.quantity > 1) updateItem(item.id, item.quantity - 1)
              else removeItem(item.id)
            }}
            className="p-1 border border-[#E5E5E5] rounded hover:border-[#111111] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateItem(item.id, item.quantity + 1)}
            className="p-1 border border-[#E5E5E5] rounded hover:border-[#111111] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="shrink-0 p-1.5 text-[#999999] hover:text-[#111111] transition-colors self-start"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
