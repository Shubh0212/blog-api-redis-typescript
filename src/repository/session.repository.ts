import { Session } from "../model/session.model";

export const sessionRepository = {
  create: (data: {
    userId: unknown;
    token: string;
    expiresAt: Date;
    userAgent: string;
  }) => Session.create(data),
  findByToken: (token: string) => Session.findOne({ token }),
  deleteByToken: (token: string) => Session.deleteOne({ token }),
};
