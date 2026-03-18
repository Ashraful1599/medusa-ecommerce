"use client"
import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  wishlistIds: string[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("wishlist")
    if (stored) setWishlistIds(JSON.parse(stored))
  }, [])

  const toggle = (productId: string) => {
    setWishlistIds(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      localStorage.setItem("wishlist", JSON.stringify(next))
      return next
    })
  }

  const isWishlisted = (productId: string) => wishlistIds.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
