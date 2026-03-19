"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/providers/cart-provider"
import { CartDrawer } from "@/components/cart/CartDrawer"

export function CartIcon() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 text-gray-600 hover:text-[#111111] transition-colors"
        aria-label={`Cart, ${itemCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        <span
          aria-live="polite"
          aria-atomic="true"
          className={`absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[#F0C040] text-[#111111] text-[10px] font-bold transition-opacity ${itemCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {itemCount > 99 ? "99+" : itemCount > 0 ? itemCount : ""}
        </span>
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
