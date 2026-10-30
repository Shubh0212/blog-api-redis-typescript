import bcrypt from "bcryptjs";
import { userRepository } from "../../repository/user.repository";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import { sessionRepository } from "../../repository/session.repository";
import { SESSION_TTL_SECONDS } from "../../constants/redis";
import { cacheSession, uncacheSession } from "./session.cache";
import {
  recordLoginFailure,
  clearLoginFailures,
} from "../../middlewares/loginRateLimit";

export const authService = {
  async signup(data: { name: string; email: string; password: string }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new AppError(409, "Email already registered");

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({ ...data, password: hashed });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  // inside authService:
  async login(email: string, password: string, userAgent: string) {
    const user = await userRepository.findByEmailWithPassword(email);
    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !valid) {
      await recordLoginFailure(email);
      throw new AppError(401, "Invalid email or password"); // same message for both cases
    }
    await clearLoginFailures(email);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await sessionRepository.create({
      userId: user._id,
      token,
      expiresAt,
      userAgent,
    });
    await cacheSession(token, user._id.toString(), expiresAt);

    return {
      token,
      expiresAt,
      user: { id: user._id, name: user.name, email: user.email },
    };
  },

  async logout(token: string, userId: string) {
    await sessionRepository.deleteByToken(token); // MongoDB first
    await uncacheSession(token, userId); // then Redis
  },
};
