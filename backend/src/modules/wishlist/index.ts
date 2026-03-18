import { Module } from "@medusajs/framework/utils"
import WishlistModuleService from "./service"

export const WISHLIST_MODULE = "wishlistModule"
export default Module(WISHLIST_MODULE, { service: WishlistModuleService })
