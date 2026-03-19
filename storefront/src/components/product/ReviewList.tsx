"use client"

import { useQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"
import { sdk } from "@/lib/medusa"
import { Skeleton } from "@/components/ui/Skeleton"

interface ProductReview {
  id: string
  product_id: string
  customer_id: string | null
  author_name: string
  rating: number
  content: string | null
  helpful_count: number
  created_at: string
}

interface ReviewListProps {
  productId: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <Star key={i} className="h-4 w-4 fill-current text-[#F0C040]" />
        ) : (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        )
      )}
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="py-4 border-b border-[#E5E5E5] space-y-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export function ReviewList({ productId }: ReviewListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () =>
      sdk.client.fetch<{ reviews: ProductReview[] }>(
        "/store/reviews/" + productId,
        { method: "GET" }
      ),
  })

  const reviews = data?.reviews ?? []

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <ReviewSkeleton />
        <ReviewSkeleton />
        <ReviewSkeleton />
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#111111] mb-4">
        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
      </p>

      {reviews.length === 0 ? (
        <p className="text-sm text-[#999999]">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="divide-y divide-[#E5E5E5]">
          {reviews.map((review) => (
            <div key={review.id} className="py-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-semibold text-[#111111]">
                  {review.author_name}
                </span>
                <span className="text-xs text-[#999999]">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.content && (
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {review.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
