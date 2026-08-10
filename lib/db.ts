import { neon } from '@neondatabase/serverless'

export function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL env var not set')
  return neon(url)
}

export function isDbConfigured() {
  return !!process.env.DATABASE_URL
}
