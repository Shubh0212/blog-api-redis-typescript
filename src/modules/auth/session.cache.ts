import { redis } from "../../providers/redis";
import { RedisKeys, SESSION_TTL_SECONDS } from "../../constants/redis";

export const cacheSession = async (
  token: string,
  userId: string,
  expiresAt: Date,
) => {
  const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  if (ttl <= 0) return;
  try {
    await redis
      .multi()
      .set(RedisKeys.session(token), userId, "EX", ttl) // same expiry as MongoDB
      .sadd(RedisKeys.userSessions(userId), token)
      .expire(RedisKeys.userSessions(userId), SESSION_TTL_SECONDS) // the Set needs a TTL too
      .exec();
  } catch (err) {
    console.error("Redis cacheSession failed:", (err as Error).message);
  }
};

export const uncacheSession = async (token: string, userId: string) => {
  try {
    await redis
      .multi()
      .del(RedisKeys.session(token))
      .srem(RedisKeys.userSessions(userId), token)
      .exec();
  } catch (err) {
    console.error("Redis uncacheSession failed:", (err as Error).message);
  }
};
