import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../../modules/review"
import ReviewModuleService from "../../modules/review/service"

export const createReviewStep = createStep(
  "create-review-step",
  async (input: {
    product_id: string
    customer_id?: string
    author_name: string
    rating: number
    content?: string
  }, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE)
    const review = await reviewService.createReviews(input)
    return new StepResponse(review, review.id)
  },
  async (reviewId: string, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE)
    await reviewService.deleteReviews(reviewId)
  }
)
