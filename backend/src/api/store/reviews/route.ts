import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { createReviewWorkflow } from "../../../workflows/create-review"
import type { CreateReviewBody } from "../../middlewares"

export const POST = async (req: MedusaStoreRequest<CreateReviewBody>, res: MedusaResponse) => {
  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      customer_id: req.auth_context?.actor_id,
    },
  })
  res.status(201).json({ review: result })
}
