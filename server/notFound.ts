import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Response } from 'express'
import { config } from './config.ts'

const notFoundPath = join(config.publicDir, '404.html')

export function sendNotFound(res: Response) {
  if (existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath)
    return
  }
  res.status(404).send('Not Found')
}
