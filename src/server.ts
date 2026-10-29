import app from "./app";
import { config } from "./constants/config";
import { connectMongo } from "./providers/database/connection";
import { redis } from "./providers/redis";

const start = async () => {
  await connectMongo();
  await redis.connect();
  console.log("Redis connected");
  app.listen(config.port, () =>
    console.log(`Server running on port ${config.port}`),
  );
};

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
