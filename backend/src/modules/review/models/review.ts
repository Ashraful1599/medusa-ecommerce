import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_id: model.text().nullable(),
  author_name: model.text(),
  rating: model.number(),
  content: model.text().nullable(),
  helpful_count: model.number().default(0),
})
