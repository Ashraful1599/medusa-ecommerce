import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import type WishlistModuleService from "../../modules/wishlist/service"

type ToggleResult =
  | { action: "removed"; product_id: string }
  | { action: "added"; item: { id: string; customer_id: string; product_id: string } }

type CompensationData =
  | { action: "added"; item_id: string }
  | { action: "removed"; customer_id: string; product_id: string }

export const toggleWishlistStep = createStep(
  "toggle-wishlist-step",
  async (
    input: { customer_id: string; product_id: string },
    { container }
  ): Promise<StepResponse<ToggleResult, CompensationData>> => {
    const wishlistService = container.resolve<WishlistModuleService>(WISHLIST_MODULE)
    const [existing] = await wishlistService.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })
    if (existing) {
      await wishlistService.deleteWishlistItems(existing.id)
      return new StepResponse<ToggleResult, CompensationData>(
        { action: "removed", product_id: input.product_id },
        { action: "removed", customer_id: input.customer_id, product_id: input.product_id }
      )
    }
    const item = await wishlistService.createWishlistItems(input)
    return new StepResponse<ToggleResult, CompensationData>(
      { action: "added", item: item as any },
      { action: "added", item_id: item.id }
    )
  },
  async (compensationData: CompensationData, { container }) => {
    const wishlistService = container.resolve<WishlistModuleService>(WISHLIST_MODULE)
    if (compensationData.action === "added") {
      // We added an item, so compensation is to remove it
      await wishlistService.deleteWishlistItems(compensationData.item_id)
    } else {
      // We removed an item, so compensation is to re-create it
      await wishlistService.createWishlistItems({
        customer_id: compensationData.customer_id,
        product_id: compensationData.product_id,
      })
    }
  }
)
