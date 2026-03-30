import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL environment variable is required")

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required")

const cookieSecret = process.env.COOKIE_SECRET
if (!cookieSecret) throw new Error("COOKIE_SECRET environment variable is required")

module.exports = defineConfig({
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  projectConfig: {
    databaseUrl,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret,
      cookieSecret,
    }
  },
  modules: [
    {
      resolve: "./src/modules/meilisearch",
      options: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
        productIndexName: process.env.MEILISEARCH_PRODUCT_INDEX_NAME || "products",
      },
    },
    {
      resolve: "./src/modules/review",
      key: "reviewModule",
    },
    {
      resolve: "./src/modules/wishlist",
      key: "wishlistModule",
    },
  ],
})
