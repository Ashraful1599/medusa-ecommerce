import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { toggleWishlistStep } from "./steps/toggle-wishlist"

export const toggleWishlistWorkflow = createWorkflow(
  "toggle-wishlist",
  function (input: { customer_id: string; product_id: string }) {
    const result = toggleWishlistStep(input)
    return new WorkflowResponse(result)
  }
)
