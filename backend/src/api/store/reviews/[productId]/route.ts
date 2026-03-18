import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../../modules/review"
import ReviewModuleService from "../../../../modules/review/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const reviewService: ReviewModuleService = req.scope.resolve(REVIEW_MODULE)
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const offset = Number(req.query.offset) || 0

  const [reviews, count] = await reviewService.listAndCountReviews(
    { product_id: req.params.productId },
    { order: { created_at: "DESC" }, skip: offset, take: limit }
  )
  res.json({ reviews, count, limit, offset })
}
