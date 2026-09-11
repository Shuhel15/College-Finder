import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  redis.on("error", (error) => {
    console.error("Redis error:", error.message);
  });
}

export const REDIS_TTL = {
  COLLEGE_LIST: 60,
  COLLEGE_DETAIL: 300,
};

export const collegeListCacheKey = (params: string) =>
  `college:list:${params}`;

export const collegeDetailCacheKey = (id: string) =>
  `college:detail:${id}`;

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    const cached = await redis.get(key);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as T;
  } catch (error) {
    console.error(
      `Redis GET failed for ${key}:`,
      error instanceof Error ? error.message : "Unknown error"
    );

    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttl: number
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.error(
      `Redis SET failed for ${key}:`,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}


export async function invalidateCollegeCache(
  id?: string
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    if (id) {
      await redis.del(collegeDetailCacheKey(id));
    }

    const keys = await redis.keys("college:list:*");

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error(
      "Redis cache invalidation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}