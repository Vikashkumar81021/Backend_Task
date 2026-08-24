import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import {
  assignUserToTaskController,
  bulkUpdateTaskStatusController,
  deleteTaskController,
  filterTaskByAssigneeController,
  filterTaskByDueDateController,
  getProjectDashboardController,
  getTaskController,
  getTasksWithCursorController,
  priorityFilterController,
  statusFilterController,
  taskController,
  unassignUserFromTaskController,
  updateTaskController,
} from "../controllers/task.controller.ts";

const taskRoutes = Router();
taskRoutes.post("/", authMiddleware, taskController);
taskRoutes.get("/", authMiddleware, getTaskController);
taskRoutes.patch("/:id", authMiddleware, updateTaskController);
taskRoutes.delete("/tasks/:id", authMiddleware, deleteTaskController);
taskRoutes.get("/filter/status", authMiddleware, statusFilterController);
taskRoutes.get("/filter/priority", authMiddleware, priorityFilterController);
taskRoutes.post("/:taskId/assign", authMiddleware, assignUserToTaskController);
taskRoutes.delete(
  "/:taskId/assign/:userId",
  authMiddleware,
  unassignUserFromTaskController,
);
taskRoutes.get(
  "/filter/assignee",
  authMiddleware,
  filterTaskByAssigneeController,
);
taskRoutes.get(
  "/tasks/filter/due-date",
  authMiddleware,
  filterTaskByDueDateController,
);
taskRoutes.get(
  "/tasks/pagination",
  authMiddleware,
  getTasksWithCursorController,
);
taskRoutes.get(
  "/projects/:id/dashboard",
  authMiddleware,
  getProjectDashboardController,
);
taskRoutes.patch(
  "/tasks/bulk-status",
  authMiddleware,
  bulkUpdateTaskStatusController,
);
export { taskRoutes };
