import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../../modules/review"
import ReviewModuleService from "../../../../modules/review/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const reviewService: ReviewModuleService = req.scope.resolve(REVIEW_MODULE)
  const reviews = await reviewService.listReviews(
    { product_id: req.params.productId },
    { order: { created_at: "DESC" }, skip: 0, take: 20 }
  )
  res.json({ reviews })
}
