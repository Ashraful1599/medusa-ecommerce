"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X, ShoppingBag } from "lucide-react"
import { useCart } from "@/providers/cart-provider"
import { formatPrice } from "@/lib/utils"
import { CartItem } from "./CartItem"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, itemCount } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const subtotal = cart?.subtotal ?? 0
  const currencyCode = cart?.currency_code ?? "usd"
  const items = cart?.items ?? []

  const drawer = (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Shopping cart"
      className={`fixed inset-0 z-[999] flex justify-end transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        style={{ width: "min(420px, 100vw)" }}
        className={`relative flex flex-col h-full bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#111111]" />
            <h2 className="font-bold text-[#111111]">Your Cart</h2>
            {itemCount > 0 && (
              <span className="text-xs font-semibold bg-[#F0C040] text-[#111111] px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#111111] transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingBag className="h-14 w-14 text-gray-200" />
              <p className="text-sm text-gray-400">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-2 text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-[#F0C040] transition-colors"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] px-5 py-5 space-y-4 bg-white">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
              <span className="font-bold text-base text-[#111111]">{formatPrice(subtotal, currencyCode)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={onClose}>
                <button className="w-full py-3.5 bg-[#111111] text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors">
                  Checkout
                </button>
              </Link>
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#E5E5E5] text-sm font-semibold text-[#111111] rounded-sm hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawer, document.body)
}
