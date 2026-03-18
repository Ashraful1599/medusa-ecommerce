"use client"
import { useState } from "react"
import { sdk } from "@/lib/medusa"
import { toast } from "sonner"
import { Tag } from "lucide-react"
import { useCart } from "@/providers/cart-provider"

export function PromoCodeInput({ cartId }: { cartId: string }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const { cart } = useCart()

  // List of currently applied codes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appliedCodes = ((cart as any)?.promotions?.map((p: any) => p.code) ?? []).filter(Boolean)

  const apply = async () => {
    if (!code.trim()) return
    setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sdk.store.cart.update as any)(cartId, { promo_codes: [code.trim().toUpperCase()] })
      toast.success(`Promo code applied`)
      setCode("")
    } catch {
      toast.error("Invalid or expired promo code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && apply()}
            placeholder="Promo code"
            className="w-full pl-8 pr-3 py-2 text-sm border border-[#E5E5E5] rounded-sm focus:outline-none focus:border-[#111111] uppercase placeholder:normal-case"
          />
        </div>
        <button
          onClick={apply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-[#111111] text-white text-sm font-semibold rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          Apply
        </button>
      </div>
      {appliedCodes.length > 0 && (
        <p className="mt-2 text-xs text-green-600 font-medium">
          Applied: {appliedCodes.join(", ")}
        </p>
      )}
    </div>
  )
}
