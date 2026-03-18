import { ExecArgs } from "@medusajs/framework/types"
import { PromotionTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

// ---------------------------------------------------------------------------
// Helper workflow to update store currencies (mirrors the scaffold pattern)
// ---------------------------------------------------------------------------
const updateStoreCurrencies = createWorkflow(
  "update-store-currencies-seed",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[]
    store_id: string
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((c) => ({
          currency_code: c.currency_code,
          is_default: c.is_default ?? false,
        })),
      },
    }))

    const stores = updateStoresStep(normalizedInput)
    return new WorkflowResponse(stores)
  }
)

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
export default async function seedData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)
  const promotionModuleService = container.resolve(Modules.PROMOTION)

  try {
    // -----------------------------------------------------------------------
    // 1. Sales Channel
    // -----------------------------------------------------------------------
    logger.info("Seeding sales channel...")
    const [store] = await storeModuleService.listStores()

    let defaultSalesChannel =
      await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
      })

    if (!defaultSalesChannel.length) {
      const { result } = await createSalesChannelsWorkflow(container).run({
        input: {
          salesChannelsData: [{ name: "Default Sales Channel" }],
        },
      })
      defaultSalesChannel = result
    }

    const salesChannelId = defaultSalesChannel[0].id

    // -----------------------------------------------------------------------
    // 2. Store — supported currencies
    // -----------------------------------------------------------------------
    logger.info("Updating store currencies (USD, GBP, BDT)...")
    await updateStoreCurrencies(container).run({
      input: {
        store_id: store.id,
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "gbp" },
          { currency_code: "bdt" },
        ],
      },
    })

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: { default_sales_channel_id: salesChannelId },
      },
    })

    // -----------------------------------------------------------------------
    // 3. Regions
    // -----------------------------------------------------------------------
    logger.info("Seeding regions (US, UK, Bangladesh)...")
    const { result: regionResult } = await createRegionsWorkflow(
      container
    ).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: ["pp_system_default"],
          },
          {
            name: "United Kingdom",
            currency_code: "gbp",
            countries: ["gb"],
            payment_providers: ["pp_system_default"],
          },
          {
            name: "Bangladesh",
            currency_code: "bdt",
            countries: ["bd"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })

    const regionUS = regionResult.find((r) => r.name === "United States")!
    const regionUK = regionResult.find((r) => r.name === "United Kingdom")!
    const regionBD = regionResult.find((r) => r.name === "Bangladesh")!

    // -----------------------------------------------------------------------
    // Tax regions
    // -----------------------------------------------------------------------
    logger.info("Seeding tax regions...")
    await createTaxRegionsWorkflow(container).run({
      input: [
        { country_code: "us", provider_id: "tp_system" },
        { country_code: "gb", provider_id: "tp_system" },
        { country_code: "bd", provider_id: "tp_system" },
      ],
    })

    // -----------------------------------------------------------------------
    // 4. Stock location + fulfillment
    // -----------------------------------------------------------------------
    logger.info("Seeding stock location & fulfillment...")
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Main Warehouse",
            address: {
              city: "New York",
              country_code: "US",
              address_1: "1 Commerce Blvd",
            },
          },
        ],
      },
    })
    const stockLocation = stockLocationResult[0]

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: { default_location_id: stockLocation.id },
      },
    })

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })

    // Shipping profile
    const existingProfiles =
      await fulfillmentModuleService.listShippingProfiles({ type: "default" })
    let shippingProfile = existingProfiles.length ? existingProfiles[0] : null

    if (!shippingProfile) {
      const { result: spResult } = await createShippingProfilesWorkflow(
        container
      ).run({
        input: {
          data: [{ name: "Default Shipping Profile", type: "default" }],
        },
      })
      shippingProfile = spResult[0]
    }

    // Fulfillment set with service zones for all 3 countries
    const fulfillmentSet =
      await fulfillmentModuleService.createFulfillmentSets({
        name: "Global Delivery",
        type: "shipping",
        service_zones: [
          {
            name: "Global",
            geo_zones: [
              { country_code: "us", type: "country" },
              { country_code: "gb", type: "country" },
              { country_code: "bd", type: "country" },
            ],
          },
        ],
      })

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })

    const serviceZoneId = fulfillmentSet.service_zones[0].id

    // -----------------------------------------------------------------------
    // 5. Shipping options (Standard + Express per region)
    // -----------------------------------------------------------------------
    logger.info("Seeding shipping options...")
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile!.id,
          type: {
            label: "Standard",
            description: "Delivered in 5-7 business days.",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 0 },
            { currency_code: "gbp", amount: 0 },
            { currency_code: "bdt", amount: 0 },
            { region_id: regionUS.id, amount: 0 },
            { region_id: regionUK.id, amount: 0 },
            { region_id: regionBD.id, amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile!.id,
          type: {
            label: "Express",
            description: "Delivered in 1-2 business days.",
            code: "express",
          },
          prices: [
            { currency_code: "usd", amount: 9.99 },
            { currency_code: "gbp", amount: 7.89 },
            { currency_code: "bdt", amount: 1099 },
            { region_id: regionUS.id, amount: 9.99 },
            { region_id: regionUK.id, amount: 7.89 },
            { region_id: regionBD.id, amount: 1099 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [salesChannelId] },
    })

    // -----------------------------------------------------------------------
    // 6. Product categories
    // -----------------------------------------------------------------------
    logger.info("Seeding product categories...")
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [
          { name: "Fashion", handle: "fashion", is_active: true },
          { name: "Medicine", handle: "medicine", is_active: true },
          { name: "Electronics", handle: "electronics", is_active: true },
          { name: "Home & Living", handle: "home-living", is_active: true },
          { name: "Sports", handle: "sports", is_active: true },
        ],
      },
    })

    const catId = (name: string) =>
      categoryResult.find((c) => c.name === name)!.id

    const fashionId = catId("Fashion")
    const medicineId = catId("Medicine")
    const electronicsId = catId("Electronics")
    const homeId = catId("Home & Living")
    const sportsId = catId("Sports")

    // -----------------------------------------------------------------------
    // Helpers for prices & variants
    // -----------------------------------------------------------------------
    const prices = (usd: number) => [
      { currency_code: "usd", amount: usd },
      { currency_code: "gbp", amount: Math.round(usd * 0.79 * 100) / 100 },
      { currency_code: "bdt", amount: Math.round(usd * 110) },
    ]

    const sc = [{ id: salesChannelId }]

    // -----------------------------------------------------------------------
    // 7. Products
    // -----------------------------------------------------------------------
    logger.info("Seeding products...")

    // ---- FASHION ----
    await createProductsWorkflow(container).run({
      input: {
        products: [
          // Men's Classic T-Shirt
          {
            title: "Men's Classic T-Shirt",
            handle: "mens-classic-tshirt",
            description:
              "A timeless classic that belongs in every wardrobe. Made from 100% premium cotton for all-day comfort.",
            category_ids: [fashionId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            options: [
              { title: "Size", values: ["S", "M", "L", "XL"] },
              { title: "Color", values: ["White", "Black", "Navy"] },
            ],
            variants: [
              {
                title: "S / White",
                sku: "TSHIRT-S-WHITE",
                options: { Size: "S", Color: "White" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "S / Black",
                sku: "TSHIRT-S-BLACK",
                options: { Size: "S", Color: "Black" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "M / White",
                sku: "TSHIRT-M-WHITE",
                options: { Size: "M", Color: "White" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "M / Black",
                sku: "TSHIRT-M-BLACK",
                options: { Size: "M", Color: "Black" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "M / Navy",
                sku: "TSHIRT-M-NAVY",
                options: { Size: "M", Color: "Navy" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "L / White",
                sku: "TSHIRT-L-WHITE",
                options: { Size: "L", Color: "White" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "L / Black",
                sku: "TSHIRT-L-BLACK",
                options: { Size: "L", Color: "Black" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "XL / Black",
                sku: "TSHIRT-XL-BLACK",
                options: { Size: "XL", Color: "Black" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "XL / Navy",
                sku: "TSHIRT-XL-NAVY",
                options: { Size: "XL", Color: "Navy" },
                manage_inventory: false,
                prices: prices(19.99),
              },
            ],
            sales_channels: sc,
          },

          // Women's Summer Dress
          {
            title: "Women's Summer Dress",
            handle: "womens-summer-dress",
            description:
              "Light, breezy and effortlessly elegant. Perfect for warm summer days and casual outings.",
            category_ids: [fashionId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
            options: [
              { title: "Size", values: ["XS", "S", "M", "L"] },
              { title: "Color", values: ["Floral", "Blue", "Pink"] },
            ],
            variants: [
              {
                title: "XS / Floral",
                sku: "DRESS-XS-FLORAL",
                options: { Size: "XS", Color: "Floral" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "S / Floral",
                sku: "DRESS-S-FLORAL",
                options: { Size: "S", Color: "Floral" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "S / Blue",
                sku: "DRESS-S-BLUE",
                options: { Size: "S", Color: "Blue" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "M / Floral",
                sku: "DRESS-M-FLORAL",
                options: { Size: "M", Color: "Floral" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "M / Pink",
                sku: "DRESS-M-PINK",
                options: { Size: "M", Color: "Pink" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "L / Blue",
                sku: "DRESS-L-BLUE",
                options: { Size: "L", Color: "Blue" },
                manage_inventory: false,
                prices: prices(49.99),
              },
            ],
            sales_channels: sc,
          },

          // Denim Jacket
          {
            title: "Denim Jacket",
            handle: "denim-jacket",
            description:
              "A wardrobe staple. Classic cut with modern stitching, built to last season after season.",
            category_ids: [fashionId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
            options: [
              { title: "Size", values: ["S", "M", "L", "XL"] },
              { title: "Color", values: ["Blue", "Black"] },
            ],
            variants: [
              {
                title: "S / Blue",
                sku: "DENIM-S-BLUE",
                options: { Size: "S", Color: "Blue" },
                manage_inventory: false,
                prices: prices(79.99),
              },
              {
                title: "M / Blue",
                sku: "DENIM-M-BLUE",
                options: { Size: "M", Color: "Blue" },
                manage_inventory: false,
                prices: prices(79.99),
              },
              {
                title: "M / Black",
                sku: "DENIM-M-BLACK",
                options: { Size: "M", Color: "Black" },
                manage_inventory: false,
                prices: prices(79.99),
              },
              {
                title: "L / Blue",
                sku: "DENIM-L-BLUE",
                options: { Size: "L", Color: "Blue" },
                manage_inventory: false,
                prices: prices(79.99),
              },
              {
                title: "L / Black",
                sku: "DENIM-L-BLACK",
                options: { Size: "L", Color: "Black" },
                manage_inventory: false,
                prices: prices(79.99),
              },
              {
                title: "XL / Black",
                sku: "DENIM-XL-BLACK",
                options: { Size: "XL", Color: "Black" },
                manage_inventory: false,
                prices: prices(79.99),
              },
            ],
            sales_channels: sc,
          },

          // Running Sneakers
          {
            title: "Running Sneakers",
            handle: "running-sneakers",
            description:
              "High-performance running shoes with advanced cushioning and breathable mesh upper.",
            category_ids: [fashionId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            options: [{ title: "Size", values: ["7", "8", "9", "10", "11"] }],
            variants: [
              {
                title: "Size 7",
                sku: "SNEAKER-7",
                options: { Size: "7" },
                manage_inventory: false,
                prices: prices(89.99),
              },
              {
                title: "Size 8",
                sku: "SNEAKER-8",
                options: { Size: "8" },
                manage_inventory: false,
                prices: prices(89.99),
              },
              {
                title: "Size 9",
                sku: "SNEAKER-9",
                options: { Size: "9" },
                manage_inventory: false,
                prices: prices(89.99),
              },
              {
                title: "Size 10",
                sku: "SNEAKER-10",
                options: { Size: "10" },
                manage_inventory: false,
                prices: prices(89.99),
              },
              {
                title: "Size 11",
                sku: "SNEAKER-11",
                options: { Size: "11" },
                manage_inventory: false,
                prices: prices(89.99),
              },
            ],
            sales_channels: sc,
          },

          // Leather Wallet
          {
            title: "Leather Wallet",
            handle: "leather-wallet",
            description:
              "Slim genuine leather bifold wallet. Fits cards and cash without bulk.",
            category_ids: [fashionId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
            variants: [
              {
                title: "Default",
                sku: "WALLET-DEFAULT",
                manage_inventory: false,
                prices: prices(34.99),
              },
            ],
            sales_channels: sc,
          },
        ],
      },
    })
    logger.info("Fashion products seeded.")

    // ---- MEDICINE ----
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Vitamin C 1000mg",
            handle: "vitamin-c-1000mg",
            description:
              "High-potency Vitamin C supplement to support immune health and antioxidant protection.",
            category_ids: [medicineId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1550572017-9cf7059f4e35?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1550572017-9cf7059f4e35?w=400",
            options: [
              { title: "Quantity", values: ["30 tablets", "60 tablets", "90 tablets"] },
            ],
            variants: [
              {
                title: "30 tablets",
                sku: "VITC-30",
                options: { Quantity: "30 tablets" },
                manage_inventory: false,
                prices: prices(12.99),
              },
              {
                title: "60 tablets",
                sku: "VITC-60",
                options: { Quantity: "60 tablets" },
                manage_inventory: false,
                prices: prices(21.99),
              },
              {
                title: "90 tablets",
                sku: "VITC-90",
                options: { Quantity: "90 tablets" },
                manage_inventory: false,
                prices: prices(29.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Omega-3 Fish Oil",
            handle: "omega-3-fish-oil",
            description:
              "Premium Omega-3 fatty acids sourced from wild-caught fish. Supports heart and brain health.",
            category_ids: [medicineId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
            options: [
              { title: "Quantity", values: ["60 softgels", "120 softgels"] },
            ],
            variants: [
              {
                title: "60 softgels",
                sku: "OMEGA3-60",
                options: { Quantity: "60 softgels" },
                manage_inventory: false,
                prices: prices(18.99),
              },
              {
                title: "120 softgels",
                sku: "OMEGA3-120",
                options: { Quantity: "120 softgels" },
                manage_inventory: false,
                prices: prices(32.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Multivitamin Daily",
            handle: "multivitamin-daily",
            description:
              "Complete daily multivitamin with 23 essential vitamins and minerals for overall wellness.",
            category_ids: [medicineId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400",
            options: [
              { title: "Quantity", values: ["30 tablets", "60 tablets"] },
            ],
            variants: [
              {
                title: "30 tablets",
                sku: "MULTI-30",
                options: { Quantity: "30 tablets" },
                manage_inventory: false,
                prices: prices(14.99),
              },
              {
                title: "60 tablets",
                sku: "MULTI-60",
                options: { Quantity: "60 tablets" },
                manage_inventory: false,
                prices: prices(24.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Hand Sanitizer 500ml",
            handle: "hand-sanitizer-500ml",
            description:
              "70% alcohol-based hand sanitizer. Kills 99.9% of germs and bacteria. Gentle on skin.",
            category_ids: [medicineId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400",
            variants: [
              {
                title: "500ml",
                sku: "SANITIZER-500",
                manage_inventory: false,
                prices: prices(8.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Pain Relief Cream",
            handle: "pain-relief-cream",
            description:
              "Fast-acting topical pain relief cream for muscle aches, joint pain and back pain.",
            category_ids: [medicineId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400",
            variants: [
              {
                title: "100g tube",
                sku: "PAINCREAM-100",
                manage_inventory: false,
                prices: prices(11.99),
              },
            ],
            sales_channels: sc,
          },
        ],
      },
    })
    logger.info("Medicine products seeded.")

    // ---- ELECTRONICS ----
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Wireless Bluetooth Earbuds",
            handle: "wireless-bluetooth-earbuds",
            description:
              "True wireless earbuds with active noise cancellation, 30-hour battery life and IPX5 water resistance.",
            category_ids: [electronicsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            options: [{ title: "Color", values: ["White", "Black"] }],
            variants: [
              {
                title: "White",
                sku: "EARBUDS-WHITE",
                options: { Color: "White" },
                manage_inventory: false,
                prices: prices(59.99),
              },
              {
                title: "Black",
                sku: "EARBUDS-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(59.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "USB-C Charging Cable 2m",
            handle: "usbc-charging-cable-2m",
            description:
              "Braided USB-C to USB-C cable. Supports 100W fast charging and USB 3.2 data transfer.",
            category_ids: [electronicsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            options: [{ title: "Color", values: ["White", "Black"] }],
            variants: [
              {
                title: "White",
                sku: "USBC-2M-WHITE",
                options: { Color: "White" },
                manage_inventory: false,
                prices: prices(14.99),
              },
              {
                title: "Black",
                sku: "USBC-2M-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(14.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Laptop Stand",
            handle: "laptop-stand",
            description:
              "Ergonomic adjustable laptop stand to reduce neck strain. Supports laptops up to 17 inches.",
            category_ids: [electronicsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
            options: [{ title: "Material", values: ["Aluminum", "Plastic"] }],
            variants: [
              {
                title: "Aluminum",
                sku: "LAPTOPSTAND-ALU",
                options: { Material: "Aluminum" },
                manage_inventory: false,
                prices: prices(39.99),
              },
              {
                title: "Plastic",
                sku: "LAPTOPSTAND-PLASTIC",
                options: { Material: "Plastic" },
                manage_inventory: false,
                prices: prices(19.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Phone Case for iPhone 15",
            handle: "phone-case-iphone-15",
            description:
              "Slim protective case for iPhone 15 with military-grade drop protection and wireless charging compatibility.",
            category_ids: [electronicsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
            options: [{ title: "Color", values: ["Clear", "Black", "Blue"] }],
            variants: [
              {
                title: "Clear",
                sku: "IPHONE15CASE-CLEAR",
                options: { Color: "Clear" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "Black",
                sku: "IPHONE15CASE-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(19.99),
              },
              {
                title: "Blue",
                sku: "IPHONE15CASE-BLUE",
                options: { Color: "Blue" },
                manage_inventory: false,
                prices: prices(19.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Power Bank 20000mAh",
            handle: "power-bank-20000mah",
            description:
              "High-capacity 20000mAh power bank with dual USB-A and USB-C ports. Fast charge compatible.",
            category_ids: [electronicsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1609592806596-4e3e5c4b5e8a?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1609592806596-4e3e5c4b5e8a?w=400",
            options: [{ title: "Color", values: ["Black", "White"] }],
            variants: [
              {
                title: "Black",
                sku: "POWERBANK-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(44.99),
              },
              {
                title: "White",
                sku: "POWERBANK-WHITE",
                options: { Color: "White" },
                manage_inventory: false,
                prices: prices(44.99),
              },
            ],
            sales_channels: sc,
          },
        ],
      },
    })
    logger.info("Electronics products seeded.")

    // ---- HOME & LIVING ----
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Scented Candle Set",
            handle: "scented-candle-set",
            description:
              "Hand-poured soy wax candles in three calming scents. Perfect for home ambiance and gifting.",
            category_ids: [homeId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400",
            options: [
              { title: "Scent", values: ["Lavender", "Vanilla", "Rose"] },
            ],
            variants: [
              {
                title: "Lavender",
                sku: "CANDLE-LAVENDER",
                options: { Scent: "Lavender" },
                manage_inventory: false,
                prices: prices(24.99),
              },
              {
                title: "Vanilla",
                sku: "CANDLE-VANILLA",
                options: { Scent: "Vanilla" },
                manage_inventory: false,
                prices: prices(24.99),
              },
              {
                title: "Rose",
                sku: "CANDLE-ROSE",
                options: { Scent: "Rose" },
                manage_inventory: false,
                prices: prices(24.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Cotton Bed Sheets",
            handle: "cotton-bed-sheets",
            description:
              "400 thread count 100% Egyptian cotton bed sheets. Soft, breathable and durable for a great night's sleep.",
            category_ids: [homeId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
            options: [
              { title: "Size", values: ["Single", "Double", "King"] },
            ],
            variants: [
              {
                title: "Single",
                sku: "SHEETS-SINGLE",
                options: { Size: "Single" },
                manage_inventory: false,
                prices: prices(39.99),
              },
              {
                title: "Double",
                sku: "SHEETS-DOUBLE",
                options: { Size: "Double" },
                manage_inventory: false,
                prices: prices(49.99),
              },
              {
                title: "King",
                sku: "SHEETS-KING",
                options: { Size: "King" },
                manage_inventory: false,
                prices: prices(59.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Stainless Steel Water Bottle",
            handle: "stainless-steel-water-bottle",
            description:
              "Double-walled vacuum insulated bottle. Keeps drinks cold 24 hours, hot 12 hours. BPA-free.",
            category_ids: [homeId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
            options: [
              { title: "Color", values: ["Silver", "Black", "Blue"] },
            ],
            variants: [
              {
                title: "Silver",
                sku: "BOTTLE-SILVER",
                options: { Color: "Silver" },
                manage_inventory: false,
                prices: prices(27.99),
              },
              {
                title: "Black",
                sku: "BOTTLE-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(27.99),
              },
              {
                title: "Blue",
                sku: "BOTTLE-BLUE",
                options: { Color: "Blue" },
                manage_inventory: false,
                prices: prices(27.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Ceramic Mug Set",
            handle: "ceramic-mug-set",
            description:
              "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Holds 350ml each.",
            category_ids: [homeId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
            options: [{ title: "Color", values: ["White", "Assorted"] }],
            variants: [
              {
                title: "White",
                sku: "MUGSET-WHITE",
                options: { Color: "White" },
                manage_inventory: false,
                prices: prices(32.99),
              },
              {
                title: "Assorted",
                sku: "MUGSET-ASSORTED",
                options: { Color: "Assorted" },
                manage_inventory: false,
                prices: prices(34.99),
              },
            ],
            sales_channels: sc,
          },
        ],
      },
    })
    logger.info("Home & Living products seeded.")

    // ---- SPORTS ----
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Yoga Mat",
            handle: "yoga-mat",
            description:
              "Non-slip 6mm thick yoga mat with carrying strap. Ideal for yoga, pilates and floor exercises.",
            category_ids: [sportsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400",
            options: [
              { title: "Color", values: ["Purple", "Blue", "Green"] },
            ],
            variants: [
              {
                title: "Purple",
                sku: "YOGAMAT-PURPLE",
                options: { Color: "Purple" },
                manage_inventory: false,
                prices: prices(29.99),
              },
              {
                title: "Blue",
                sku: "YOGAMAT-BLUE",
                options: { Color: "Blue" },
                manage_inventory: false,
                prices: prices(29.99),
              },
              {
                title: "Green",
                sku: "YOGAMAT-GREEN",
                options: { Color: "Green" },
                manage_inventory: false,
                prices: prices(29.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Resistance Bands Set",
            handle: "resistance-bands-set",
            description:
              "Set of 3 resistance bands in light, medium and heavy resistance. Great for strength training and rehab.",
            category_ids: [sportsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
            variants: [
              {
                title: "3-Pack",
                sku: "RESISTBANDS-3PACK",
                manage_inventory: false,
                prices: prices(22.99),
              },
            ],
            sales_channels: sc,
          },

          {
            title: "Jump Rope",
            handle: "jump-rope",
            description:
              "Adjustable speed jump rope with ball-bearing handles for smooth, tangle-free rotation.",
            category_ids: [sportsId],
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile!.id,
            images: [
              {
                url: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800",
              },
            ],
            thumbnail:
              "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400",
            options: [{ title: "Color", values: ["Black", "Red"] }],
            variants: [
              {
                title: "Black",
                sku: "JUMPROPE-BLACK",
                options: { Color: "Black" },
                manage_inventory: false,
                prices: prices(15.99),
              },
              {
                title: "Red",
                sku: "JUMPROPE-RED",
                options: { Color: "Red" },
                manage_inventory: false,
                prices: prices(15.99),
              },
            ],
            sales_channels: sc,
          },
        ],
      },
    })
    logger.info("Sports products seeded.")

    // -----------------------------------------------------------------------
    // 8. Promotions
    // -----------------------------------------------------------------------
    logger.info("Seeding promotions...")
    const promotionsData: PromotionTypes.CreatePromotionDTO[] = [
      {
        code: "WELCOME20",
        type: "standard",
        status: "active",
        application_method: {
          type: "percentage",
          target_type: "order",
          value: 20,
        },
      },
      {
        code: "SAVE10",
        type: "standard",
        status: "active",
        application_method: {
          type: "fixed",
          target_type: "order",
          value: 10,
        },
      },
      {
        code: "FREESHIP",
        type: "standard",
        status: "active",
        application_method: {
          type: "percentage",
          target_type: "shipping_methods",
          value: 100,
        },
      },
    ]
    await promotionModuleService.createPromotions(promotionsData)
    logger.info("Promotions seeded.")

    logger.info("=== Seed complete! ===")
    logger.info(
      "Categories: Fashion, Medicine, Electronics, Home & Living, Sports"
    )
    logger.info("Products: 22 total across all categories")
    logger.info("Regions: United States (USD), United Kingdom (GBP), Bangladesh (BDT)")
    logger.info("Shipping: Standard (free) + Express ($9.99 USD equivalent)")
    logger.info("Promotions: WELCOME20, SAVE10, FREESHIP")
  } catch (err) {
    console.error("Seed script failed:", err)
    throw err
  }
}
