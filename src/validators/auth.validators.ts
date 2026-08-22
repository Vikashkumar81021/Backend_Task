import { z } from "zod";

const authSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  email: z.string().trim().email("Invalid email"),

  password: z.string().min(8, "Password is required"),
});
export const createAuthSchema = authSchema;
