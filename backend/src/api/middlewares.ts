import { authenticate, defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { z } from "zod"

const reviewSchema = z.object({
  product_id: z.string(),
  author_name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().optional(),
})

export type CreateReviewBody = z.infer<typeof reviewSchema>

const wishlistSchema = z.object({ product_id: z.string() })
export type ToggleWishlistBody = z.infer<typeof wishlistSchema>

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/reviews",
      method: "POST",
      middlewares: [validateAndTransformBody(reviewSchema)],
    },
    {
      matcher: "/store/wishlist",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/store/wishlist",
      method: "POST",
      middlewares: [validateAndTransformBody(wishlistSchema)],
    },
  ],
})
