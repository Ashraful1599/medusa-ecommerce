import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createReviewStep } from "./steps/create-review"

export const createReviewWorkflow = createWorkflow(
  "create-review",
  function (input: {
    product_id: string
    customer_id?: string
    author_name: string
    rating: number
    content?: string
  }) {
    const review = createReviewStep(input)
    return new WorkflowResponse(review)
  }
)
