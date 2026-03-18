"use client"
import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/providers/cart-provider"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"

interface AddToCartButtonProps {
  variantId: string | null
  quantity: number
}

export function AddToCartButton({ variantId, quantity }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleClick = async () => {
    if (!variantId) return
    setLoading(true)
    try {
      await addItem(variantId, quantity)
      setAdded(true)
      toast.success("Added to cart")
      setTimeout(() => setAdded(false), 2000)
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setLoading(false)
    }
  }

  if (!variantId) {
    return (
      <Button variant="primary" size="lg" className="w-full" disabled>
        Select options to add to cart
      </Button>
    )
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full"
      onClick={handleClick}
      isLoading={loading}
      disabled={loading || added}
    >
      {added ? (
        <><Check className="mr-2 h-4 w-4" /> Added to Cart</>
      ) : (
        <><ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>
      )}
    </Button>
  )
}
