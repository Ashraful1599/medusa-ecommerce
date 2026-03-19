"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Truck, RotateCcw } from "lucide-react"
import { ReviewList } from "./ReviewList"
import { ReviewForm } from "./ReviewForm"

type Tab = "description" | "reviews" | "shipping"

interface ProductTabsProps {
  description?: string | null
  productId: string
}

export function ProductTabs({ description, productId }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "reviews", label: "Reviews" },
    { key: "shipping", label: "Shipping & Returns" },
  ]

  return (
    <div className="mt-10 border-t border-[#E5E5E5]">
      {/* Tab buttons */}
      <div className="flex border-b border-[#E5E5E5]">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#999999] hover:text-[#111111]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none text-gray-700">
            {description ? (
              <p className="leading-relaxed">{description}</p>
            ) : (
              <p className="text-[#999999]">No description available.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <ReviewList productId={productId} />
            <ReviewForm productId={productId} />
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-[#999999] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Free Standard Shipping</p>
                <p className="text-[#999999]">Free on orders over $50. Delivered in 5-7 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-[#999999] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">30-Day Returns</p>
                <p className="text-[#999999]">Return any item within 30 days for a full refund.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
