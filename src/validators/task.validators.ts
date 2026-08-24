import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must not exceed 200 characters"),

  description: z.string().trim().optional(),

  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),

  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),

  dueDate: z.coerce.date().optional(),

  projectId: z.number().int().positive("Invalid project ID"),
});
export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),

  description: z.string().trim().optional(),

  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),

  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

  dueDate: z.coerce.date().optional(),
});
export const taskFilterSchema = z.object({
  status: z.enum(["todo", "in_progress", "review", "done"]),
});
export const priorityFilterSchema = z.object({
  priority: z.enum(["low", "medium", "high", "urgent"]),
});
export const assignTaskSchema = z.object({
  userId: z.number().int().positive("Invalid user ID"),
});
export const assigneeFilterSchema = z.object({
  userId: z.coerce.number().int().positive("Invalid user ID"),
});
export const dueDateFilterSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});
export const taskPaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),

  cursor: z.coerce.number().int().positive().optional(),
});
export const bulkUpdateTaskStatusSchema = z.object({
  taskIds: z
    .array(z.number().int().positive("Invalid task ID"))
    .min(1, "At least one task ID is required"),

  status: z.enum(["todo", "in_progress", "review", "done"]),
});
