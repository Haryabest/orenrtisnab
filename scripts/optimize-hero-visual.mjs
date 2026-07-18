import { access, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
const source = join(root, 'public', 'images', 'photo1.jpg')
const output = join(root, 'public', 'images', 'hero-visual.webp')

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

if (!(await exists(source))) {
  if (await exists(output)) {
    console.log('hero-visual: source missing, keeping existing hero-visual.webp')
    process.exit(0)
  }
  console.error('hero-visual: missing public/images/photo1.jpg and public/images/hero-visual.webp')
  process.exit(1)
}

const MAX_SIDE = 1200
const WEBP_QUALITY = 85

const input = await readFile(source)
const optimized = await sharp(input, { failOn: 'none' })
  .rotate()
  .resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: WEBP_QUALITY, effort: 4, smartSubsample: true })
  .toBuffer()

await writeFile(output, optimized)

const inputKb = Math.round(input.length / 1024)
const outputKb = Math.round(optimized.length / 1024)
console.log(`hero-visual: ${inputKb} KB -> ${outputKb} KB (public/images/hero-visual.webp)`)
