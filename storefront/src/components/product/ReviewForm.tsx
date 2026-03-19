"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  productId: string
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { customer } = useAuth()
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [authorName, setAuthorName] = useState(customer?.first_name ?? "")

  // Sync author name when auth resolves after initial render
  useEffect(() => {
    if (customer?.first_name && !authorName) {
      setAuthorName(customer.first_name)
    }
  }, [customer?.first_name]) // eslint-disable-line react-hooks/exhaustive-deps
  const [content, setContent] = useState("")
  const [ratingError, setRatingError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setRatingError(true)
      return
    }

    setRatingError(false)
    setIsSubmitting(true)

    try {
      await sdk.client.fetch("/store/reviews", {
        method: "POST",
        body: { product_id: productId, author_name: authorName, rating, content },
      })
      toast.success("Review submitted!")
      setRating(0)
      setHoverRating(0)
      setAuthorName(customer?.first_name ?? "")
      setContent("")
      await queryClient.invalidateQueries({ queryKey: ["reviews", productId] })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="mt-8 border-t border-[#E5E5E5] pt-6">
      <h3 className="text-sm font-semibold text-[#111111] mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star selector */}
        <div>
          <label className="block text-xs font-medium text-[#999999] mb-1">
            Rating <span className="text-red-500">*</span>
          </label>
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setRating(value)
                    setRatingError(false)
                  }}
                  onMouseEnter={() => setHoverRating(value)}
                  className="focus:outline-none"
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      value <= displayRating
                        ? "fill-current text-[#F0C040]"
                        : "text-gray-300"
                    )}
                  />
                </button>
              )
            })}
          </div>
          {ratingError && (
            <p className="mt-1 text-xs text-red-500">
              Please select a star rating.
            </p>
          )}
        </div>

        {/* Author name */}
        <div>
          <label
            htmlFor="review-author"
            className="block text-xs font-medium text-[#999999] mb-1"
          >
            Name
          </label>
          <input
            id="review-author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full border border-[#E5E5E5] rounded-sm px-3 py-2 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="review-content"
            className="block text-xs font-medium text-[#999999] mb-1"
          >
            Review
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            className="w-full border border-[#E5E5E5] rounded-sm px-3 py-2 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors resize-none"
          />
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          Submit Review
        </Button>
      </form>
    </div>
  )
}
