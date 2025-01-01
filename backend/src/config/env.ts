import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

// Immediately load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

// Debug log to see raw env variables
console.log('Raw env variables:', {
  pwd: process.cwd(),
  envPath: path.resolve(process.cwd(), '.env'),
  envContent: process.env.BITCOIN_XPUB ? 'exists' : 'missing',
})

const envSchema = z.object({
  BITCOIN_XPUB: z.string({
    required_error: "BITCOIN_XPUB is required in .env file",
  }).min(1, "BITCOIN_XPUB cannot be empty"),
  BITCOIN_NETWORK: z.enum(['mainnet', 'testnet']).default('testnet'),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env = parsed.data 