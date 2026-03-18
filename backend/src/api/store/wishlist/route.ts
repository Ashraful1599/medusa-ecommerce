import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import type WishlistModuleService from "../../../modules/wishlist/service"
import { toggleWishlistWorkflow } from "../../../workflows/toggle-wishlist"
import type { ToggleWishlistBody } from "../../middlewares"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)
  const items = await wishlistService.listWishlistItems({
    customer_id: req.auth_context.actor_id,
  })
  res.json({ wishlist: items })
}

export const POST = async (req: AuthenticatedMedusaRequest<ToggleWishlistBody>, res: MedusaResponse) => {
  const { result } = await toggleWishlistWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      product_id: req.validatedBody.product_id,
    },
  })
  res.json(result)
}
