import { redis } from "../providers/redis";

export const getString = async (key: string): Promise<string | null> => {
  try {
    return await redis.get(key);
  } catch (err) {
    console.error("Redis get failed:", (err as Error).message);
    return null;
  }
};

export const getJSON = async <T>(key: string): Promise<T | null> => {
  const raw = await getString(key);
  return raw ? (JSON.parse(raw) as T) : null;
};

export const setJSON = async (
  key: string,
  value: unknown,
  ttlSeconds: number,
) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error("Redis set failed:", (err as Error).message);
  }
};

export const delKeys = async (...keys: string[]) => {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error("Redis del failed:", (err as Error).message);
  }
};
