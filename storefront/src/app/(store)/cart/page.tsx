"use client"
import { Container } from "@/components/layout/Container"
import { CartItem } from "@/components/cart/CartItem"
import { CartSummary } from "@/components/cart/CartSummary"
import { useCart } from "@/providers/cart-provider"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function CartPage() {
  const { cart, itemCount } = useCart()

  if (!cart) {
    return (
      <Container className="py-12">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-[#111111] mb-2">Your cart is empty</h1>
          <p className="text-[#999999] mb-6">Add some items to get started.</p>
          <Link href="/shop"><Button variant="primary">Browse Products</Button></Link>
        </div>
      </Container>
    )
  }

  const items = cart.items ?? []

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-[#111111] mb-2">Your cart is empty</h1>
          <p className="text-[#999999] mb-6">Add some items to get started.</p>
          <Link href="/shop"><Button variant="primary">Browse Products</Button></Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-[#111111] mb-6">
        Cart <span className="text-sm font-normal text-[#999999]">({itemCount} items)</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </Container>
  )
}
