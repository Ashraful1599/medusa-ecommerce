"use client"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { PromoCodeInput } from "./PromoCodeInput"
import { Truck } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"

export function CartSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  const currencyCode = cart.currency_code ?? "usd"
  const subtotal = cart.subtotal ?? 0
  const discount = cart.discount_total ?? 0
  const shipping = cart.shipping_total ?? 0
  const total = cart.total ?? 0

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h2 className="font-bold text-[#111111]">Order Summary</h2>

      {cart.id && <PromoCodeInput cartId={cart.id} />}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal, currencyCode)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- {formatPrice(discount, currencyCode)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" /> Shipping
          </span>
          <span className="font-medium">
            {shipping === 0 ? "Calculated at checkout" : formatPrice(shipping, currencyCode)}
          </span>
        </div>
      </div>

      <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-[#111111]">
        <span>Total</span>
        <span>{formatPrice(total, currencyCode)}</span>
      </div>

      <Link href="/checkout" className="block">
        <button className="w-full py-3 bg-[#111111] text-white font-semibold rounded-sm hover:bg-gray-800 transition-colors">
          Proceed to Checkout
        </button>
      </Link>

      <Link href="/shop" className="block text-center text-sm text-[#999999] hover:text-[#111111] transition-colors">
        Continue Shopping
      </Link>
    </div>
  )
}
