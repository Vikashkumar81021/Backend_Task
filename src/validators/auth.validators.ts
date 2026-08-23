import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  email: z.string().trim().email("Invalid email"),

  password: z.string().min(8, "Password is required"),
});

export const loginAuthSchema = z.object({
  email: z.string().trim().email("Invalid email"),

  password: z.string().min(1, "Password is required"),
});
