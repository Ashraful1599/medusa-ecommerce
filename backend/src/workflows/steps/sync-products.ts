import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MEILISEARCH_MODULE } from "../../modules/meilisearch"
import MeilisearchModuleService from "../../modules/meilisearch/service"

export type SyncProductsStepInput = {
  products: {
    id: string
    title: string
    description?: string
    handle: string
    thumbnail?: string
    categories: {
      id: string
      name: string
      handle: string
    }[]
    tags: {
      id: string
      value: string
    }[]
  }[]
}

export const syncProductsStep = createStep(
  "sync-products",
  async ({ products }: SyncProductsStepInput, { container }) => {
    if (!products.length) {
      return new StepResponse(undefined, { newProducts: [], existingProducts: [] })
    }

    const meilisearchModuleService = container.resolve<MeilisearchModuleService>(
      MEILISEARCH_MODULE
    )

    const existingProducts = await meilisearchModuleService.retrieveFromIndex(
      products.map((product) => product.id),
      "product"
    )

    const newProducts = products.filter(
      (product) =>
        !existingProducts.some((p: any) => p.id === product.id)
    )

    await meilisearchModuleService.indexData(
      products as unknown as Record<string, unknown>[],
      "product"
    )

    return new StepResponse(undefined, {
      newProducts: newProducts.map((product) => product.id),
      existingProducts,
    })
  }
)
