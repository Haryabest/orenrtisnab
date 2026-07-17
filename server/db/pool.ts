import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../config.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err)
})

let initialized = false
let dbReady = false

export function isDbReady(): boolean {
  return dbReady
}

export async function initDb(): Promise<void> {
  if (initialized) return

  try {
    const client = await pool.connect()
    try {
      await client.query('SELECT 1')
      const schema = await readFile(join(__dirname, 'schema.sql'), 'utf-8')
      await client.query(schema)
    } finally {
      client.release()
    }
    initialized = true
    dbReady = true
    console.log('PostgreSQL schema ready')
  } catch {
    initialized = true
    dbReady = false
    console.warn('PostgreSQL unavailable — using JSON file storage (development)')
  }
}

export async function closeDb(): Promise<void> {
  await pool.end()
}
