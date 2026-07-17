import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { DEFAULT_SITE_CONTENT, applyContentDefaults, type ContentSection, type SiteContent } from '../../shared/site-content.ts'
import { siteContentSchema } from '../../shared/content-schema.ts'
import { config } from '../config.ts'
import { isDbReady, pool } from '../db/pool.ts'

let cache: SiteContent | null = null

async function importFromJsonIfExists(): Promise<SiteContent | null> {
  try {
    const raw = await readFile(config.contentFile, 'utf-8')
    const parsed = siteContentSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

async function readContentFromJson(): Promise<SiteContent> {
  const content = (await importFromJsonIfExists()) ?? DEFAULT_SITE_CONTENT
  return siteContentSchema.parse(content)
}

async function writeContentToJson(content: SiteContent): Promise<SiteContent> {
  const validated = siteContentSchema.parse(content)
  await mkdir(dirname(config.contentFile), { recursive: true })
  await writeFile(config.contentFile, JSON.stringify(validated, null, 2), 'utf-8')
  return validated
}

async function ensureContentRow(): Promise<SiteContent> {
  const existing = await pool.query<{ data: SiteContent }>(
    'SELECT data FROM site_content WHERE id = 1',
  )

  if (existing.rows[0]) {
    return siteContentSchema.parse(existing.rows[0].data)
  }

  const seed = (await importFromJsonIfExists()) ?? DEFAULT_SITE_CONTENT
  const validated = siteContentSchema.parse(seed)

  await pool.query(
    `INSERT INTO site_content (id, data) VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(validated)],
  )

  return validated
}

export async function readContent(): Promise<SiteContent> {
  if (cache) return cache

  const raw = isDbReady() ? await ensureContentRow() : await readContentFromJson()
  const content = applyContentDefaults(siteContentSchema.parse(raw))
  cache = content
  return content
}

export async function writeContent(content: SiteContent): Promise<SiteContent> {
  if (!isDbReady()) {
    const validated = await writeContentToJson(content)
    cache = validated
    return validated
  }

  const validated = siteContentSchema.parse(content)

  await pool.query(
    `INSERT INTO site_content (id, data, updated_at)
     VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [JSON.stringify(validated)],
  )

  cache = validated
  return validated
}

export async function updateSection<K extends ContentSection>(
  section: K,
  data: SiteContent[K],
): Promise<SiteContent> {
  const current = await readContent()
  const next = { ...current, [section]: data }
  return writeContent(next)
}

export function invalidateContentCache() {
  cache = null
}
