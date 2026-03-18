import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL environment variable is required")

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required")

const cookieSecret = process.env.COOKIE_SECRET
if (!cookieSecret) throw new Error("COOKIE_SECRET environment variable is required")

module.exports = defineConfig({
  projectConfig: {
    databaseUrl,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret,
      cookieSecret,
    }
  }
})
