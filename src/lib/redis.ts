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


export const OTP_TTL = 600;

export const emailOtpCacheKey = (email: string) =>
  `collegefinder:otp:${email}`;

export async function setEmailOtp(
  email: string,
  otp: string,
): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    await redis.set(
      emailOtpCacheKey(email),
      otp,
      "EX",
      OTP_TTL,
    );

    return true;
  } catch (error) {
    console.error(
      "Redis OTP SET failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return false;
  }
}

export async function getEmailOtp(
  email: string,
): Promise<string | null> {
  if (!redis) {
    return null;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    return await redis.get(emailOtpCacheKey(email));
  } catch (error) {
    console.error(
      "Redis OTP GET failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return null;
  }
}

export async function deleteEmailOtp(
  email: string,
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    await redis.del(emailOtpCacheKey(email));
  } catch (error) {
    console.error(
      "Redis OTP DELETE failed:",
      error instanceof Error ? error.message : "Unknown error",
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