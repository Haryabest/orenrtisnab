import sharp from 'sharp'

const MAX_SIDE = 1400
const WEBP_QUALITY = 90

export type OptimizedImage = {
  buffer: Buffer
  ext: string
  mimeType: string
}

export async function optimizeUploadedImage(
  input: Buffer,
  mimeType: string,
): Promise<OptimizedImage> {
  if (mimeType === 'image/svg+xml') {
    return { buffer: input, ext: '.svg', mimeType }
  }

  try {
    const image = sharp(input, { failOn: 'none' }).rotate()
    const meta = await image.metadata()

    let pipeline = image
    const width = meta.width ?? 0
    const height = meta.height ?? 0

    if (width > MAX_SIDE || height > MAX_SIDE) {
      pipeline = pipeline.resize(MAX_SIDE, MAX_SIDE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    const buffer = await pipeline
      .webp({
        quality: WEBP_QUALITY,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer()

    return { buffer, ext: '.webp', mimeType: 'image/webp' }
  } catch (err) {
    console.error('Image optimization failed, saving original:', err)
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    }
    return {
      buffer: input,
      ext: extMap[mimeType] || '.jpg',
      mimeType,
    }
  }
}
