import { User } from "../model/user.model";

export const userRepository = {
  create: (data: { name: string; email: string; password: string }) =>
    User.create(data),
  findByEmail: (email: string) => User.findOne({ email }),
  findByEmailWithPassword: (email: string) =>
    User.findOne({ email }).select("+password"),
  findById: (id: string) => User.findById(id),
  updateName: (id: string, name: string) =>
    User.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }),
};
