import { User } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        organizationId: number;
        role: OrgRole;
      };
    }
  }
}

export {};
