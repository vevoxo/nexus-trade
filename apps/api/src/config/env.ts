import { config } from 'dotenv'
import { z } from 'zod'

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  MARKET_API_KEY: z.string().optional(),
  MARKET_API_PROVIDER: z.enum(['twelvedata', 'alphaVantage']).default('twelvedata')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
