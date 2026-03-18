"use client"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import type { HttpTypes } from "@medusajs/types"

interface OrderReviewProps {
  cart: HttpTypes.StoreCart
  shippingOptionName?: string
  onPlaceOrder: () => void
  onBack: () => void
  loading: boolean
}

export function OrderReview({ cart, shippingOptionName, onPlaceOrder, onBack, loading }: OrderReviewProps) {
  const items = cart.items ?? []
  const currencyCode = cart.currency_code ?? "usd"

  return (
    <div className="space-y-6">
      {/* Items */}
      <div>
        <h3 className="font-semibold text-[#111111] mb-3">Items ({items.length})</h3>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-50">
                {item.thumbnail && <Image src={item.thumbnail} alt={item.product_title ?? ""} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111111] truncate">{item.product_title}</p>
                {item.variant?.title && item.variant.title !== "Default" && (
                  <p className="text-xs text-[#999999]">{item.variant.title}</p>
                )}
                <p className="text-xs text-[#999999]">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#111111]">
                {formatPrice((item.unit_price ?? 0) * item.quantity, currencyCode)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-[#E5E5E5] pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(cart.subtotal ?? 0, currencyCode)}</span>
        </div>
        {(cart.discount_total ?? 0) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- {formatPrice(cart.discount_total ?? 0, currencyCode)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping {shippingOptionName ? `(${shippingOptionName})` : ""}</span>
          <span>{cart.shipping_total === 0 ? "Free" : formatPrice(cart.shipping_total ?? 0, currencyCode)}</span>
        </div>
        <div className="flex justify-between font-bold text-[#111111] border-t border-[#E5E5E5] pt-2">
          <span>Total</span>
          <span>{formatPrice(cart.total ?? 0, currencyCode)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={onPlaceOrder} isLoading={loading}>
          Place Order
        </Button>
      </div>
    </div>
  )
}
