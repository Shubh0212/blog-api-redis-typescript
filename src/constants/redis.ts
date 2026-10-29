export const REDIS_PREFIX = "blog_shubh:";

export const RedisKeys = {
  session: (token: string) => `${REDIS_PREFIX}session:${token}`,
  userSessions: (userId: string) => `${REDIS_PREFIX}user:${userId}:sessions`,
  user: (userId: string) => `${REDIS_PREFIX}user:${userId}`,
  post: (id: string) => `${REDIS_PREFIX}post:${id}`,
  postsListVersion: `${REDIS_PREFIX}posts:list:version`,
  stats: `${REDIS_PREFIX}stats`,
  loginFail: (email: string) => `${REDIS_PREFIX}login:fail:${email}`,
};

export const RedisTTL = {
  user: 60 * 60, // 1 hour
  post: 10 * 60, // 10 minutes
  postsList: 60, // 60 seconds
  stats: 5 * 60, // 5 minutes
  loginFail: 15 * 60, // 15 minutes
};
