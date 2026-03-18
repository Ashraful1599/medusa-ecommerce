import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

type ToggleResult =
  | { action: "removed"; product_id: string }
  | { action: "added"; item: { id: string; customer_id: string; product_id: string } }

export const toggleWishlistStep = createStep(
  "toggle-wishlist-step",
  async (input: { customer_id: string; product_id: string }, { container }): Promise<StepResponse<ToggleResult>> => {
    const wishlistService: WishlistModuleService = container.resolve(WISHLIST_MODULE)
    const [existing] = await wishlistService.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })
    if (existing) {
      await wishlistService.deleteWishlistItems(existing.id)
      return new StepResponse<ToggleResult>({ action: "removed", product_id: input.product_id })
    }
    const item = await wishlistService.createWishlistItems(input)
    return new StepResponse<ToggleResult>({ action: "added", item })
  }
)
