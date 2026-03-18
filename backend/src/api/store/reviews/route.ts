import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { createReviewWorkflow } from "../../../workflows/create-review"

const schema = z.object({
  product_id: z.string(),
  author_name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().optional(),
})

export type CreateReviewBody = z.infer<typeof schema>

export const POST = async (req: MedusaRequest<CreateReviewBody>, res: MedusaResponse) => {
  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      customer_id: req.auth_context?.actor_id,
    },
  })
  res.json({ review: result })
}
