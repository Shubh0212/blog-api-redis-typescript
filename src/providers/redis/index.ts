import Redis from "ioredis";
import { config } from "../../constants/config";

export const redis = new Redis(config.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on("error", (err) => console.error("Redis error:", err.message));
