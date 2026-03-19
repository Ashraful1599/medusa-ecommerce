"use client"

import { useQuery } from "@tanstack/react-query"
import { ShoppingBag } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/medusa"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatPrice } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

function statusVariant(status: string): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "completed":
      return "success"
    case "pending":
      return "warning"
    case "canceled":
      return "danger"
    default:
      return "neutral"
  }
}

function OrderRowSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-[#E5E5E5] rounded-sm">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { customer } = useAuth()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", customer?.id],
    queryFn: () => sdk.store.order.list({ limit: 10 }),
    enabled: !!customer?.id,
  })

  const orders = data?.orders ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-[#111111] mb-6">My Orders</h1>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-600 text-sm">Failed to load orders. Please try again.</p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-14 w-14 text-gray-300 mb-4" />
          <p className="text-[#111111] font-semibold mb-1">No orders yet</p>
          <p className="text-sm text-[#999999]">When you place an order, it will appear here.</p>
        </div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order: HttpTypes.StoreOrder) => {
            const total = order.total ?? 0
            const currency = order.currency_code ?? "usd"
            const date = order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"

            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-[#E5E5E5] rounded-sm hover:border-[#111111] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    #{order.display_id ?? order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#999999] mt-0.5">{date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusVariant(order.status ?? "")}>
                    {order.status ?? "unknown"}
                  </Badge>
                  <span className="text-sm font-semibold text-[#111111]">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
