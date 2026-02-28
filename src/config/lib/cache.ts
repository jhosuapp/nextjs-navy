import { prisma } from "./prisma"

export async function getCache<T>(key: string): Promise<T | null> {
  const record = await prisma.api_cache.findUnique({ where: { cache_key: key } })
  if (!record) return null
  if (new Date() > record.expires_at) return null
  try {
    return JSON.parse(record.data) as T
  } catch {
    return null
  }
}

export async function setCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000)
  await prisma.api_cache.upsert({
    where: { cache_key: key },
    create: {
      cache_key: key,
      data: JSON.stringify(data),
      created_at: now,
      expires_at: expiresAt,
    },
    update: {
      data: JSON.stringify(data),
      created_at: now,
      expires_at: expiresAt,
    },
  })
}

export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  const likePattern = `${prefix}%`
  await prisma.$executeRaw`DELETE FROM api_cache WHERE cache_key LIKE ${likePattern}`
}
