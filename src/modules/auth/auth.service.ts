import bcrypt from "bcryptjs";
import { userRepository } from "../../repository/user.repository";
import { AppError } from "../../utils/AppError";

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
};
