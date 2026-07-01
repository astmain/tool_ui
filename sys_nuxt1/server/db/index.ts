import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined
}

function createDb() {
  const config = useRuntimeConfig()
  const pool = new pg.Pool({
    connectionString: config.databaseUrl ?? process.env.DATABASE_URL,
  })
  return drizzle(pool, { schema })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
