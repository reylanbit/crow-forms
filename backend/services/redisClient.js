import Redis from "ioredis"

const DEFAULT_URL = "redis://red-d6ds2jcr85hc73c3ogrg:6379"
const url = process.env.REDIS_URL || DEFAULT_URL

const redis = new Redis(url, {
  lazyConnect: true,
  enableOfflineQueue: true,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 500, 5000)
    return delay
  },
  reconnectOnError: () => true
})

export async function ensureRedisConnected() {
  try {
    if (!redis.status || redis.status === "end") {
      await redis.connect()
    }
  } catch (e) {
    // swallow connect errors; retries will kick in
  }
  return redis
}

export default redis
