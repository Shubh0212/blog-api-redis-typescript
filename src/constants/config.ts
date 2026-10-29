import "dotenv/config";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
};

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: required("MONGO_URI"),
  redisUrl: required("REDIS_URL"),
};
