import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  // Only allow on local dev server — serverless deployments can't write to disk
  const host = getRequestHost(event)
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0')
  if (!isLocal) {
    throw createError({ statusCode: 403, message: 'Only available on local dev server' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, message: 'Invalid settings payload' })
  }

  const filePath = resolve(process.cwd(), 'data/default-settings.json')
  await writeFile(filePath, JSON.stringify(body, null, 2) + '\n', 'utf-8')

  return { ok: true }
})
