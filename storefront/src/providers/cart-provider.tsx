"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { sdk } from "@/lib/medusa"
import type { HttpTypes } from "@medusajs/types"

type CartContextType = {
  cart: HttpTypes.StoreCart | null
  addItem: (variantId: string, qty: number) => Promise<void>
  updateItem: (lineItemId: string, qty: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)

  useEffect(() => {
    const cartId = localStorage.getItem("cart_id")
    if (cartId) {
      sdk.store.cart.retrieve(cartId)
        .then(({ cart }) => setCart(cart))
        .catch(() => localStorage.removeItem("cart_id"))
    }
  }, [])

  const ensureCart = async () => {
    if (cart) return cart
    const { cart: newCart } = await sdk.store.cart.create({})
    localStorage.setItem("cart_id", newCart.id)
    setCart(newCart)
    return newCart
  }

  const addItem = async (variantId: string, qty: number) => {
    const c = await ensureCart()
    const { cart: updated } = await sdk.store.cart.createLineItem(c.id, { variant_id: variantId, quantity: qty })
    setCart(updated)
  }

  const updateItem = async (lineItemId: string, qty: number) => {
    if (!cart) return
    const { cart: updated } = await sdk.store.cart.updateLineItem(cart.id, lineItemId, { quantity: qty })
    setCart(updated)
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart) return
    const response = await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
    if (response.parent) {
      setCart(response.parent)
    }
  }

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
