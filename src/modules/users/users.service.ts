import { userRepository } from "../../repository/user.repository";
import { RedisKeys, RedisTTL } from "../../constants/redis";
import { getJSON, setJSON, delKeys } from "../../utils/cache";
import { AppError } from "../../utils/AppError";

type UserDoc = {
  _id: { toString(): string };
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

// Same shape every time, so Redis and MongoDB responses are identical
const toProfile = (user: UserDoc) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const usersService = {
  async getMe(userId: string) {
    const key = RedisKeys.user(userId);

    const cached = await getJSON<ReturnType<typeof toProfile>>(key);
    if (cached) return { profile: cached, cacheHit: true };

    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    const profile = toProfile(user);
    await setJSON(key, profile, RedisTTL.user); // no password is ever in this object
    return { profile, cacheHit: false };
  },

  async updateMe(userId: string, name: string) {
    const user = await userRepository.updateName(userId, name); // MongoDB first
    if (!user) throw new AppError(404, "User not found");

    await delKeys(RedisKeys.user(userId)); // then delete the cache, never edit it
    return toProfile(user);
  },
};
