import { Priority, TaskStatus } from "../generated/prisma/enums.ts";
import {
  assignUserToTask,
  bulkUpdateTaskStatus,
  createTask,
  deleteTask,
  filterTaskByAssignee,
  filterTaskByDueDate,
  getProjectDashboard,
  getTasks,
  getTasksWithCursor,
  priorityFilter,
  statusFilter,
  unassignUserFromTask,
  updateTask,
} from "../repositories/task.repositories.ts";

interface CreateTaskInput {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  projectId: number;
  organizationId: number;
}
export const createTaskService = async ({
  title,
  description,
  status,
  priority,
  dueDate,
  projectId,
  organizationId,
}: CreateTaskInput) => {
  return await createTask(
    title,
    description,
    status,
    priority,
    dueDate,
    projectId,
    organizationId,
  );
};

export const getTasksService = async (organizationId: number) => {
  return await getTasks(organizationId);
};

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "review" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
}

export const updateTaskService = async (
  id: number,
  organizationId: number,
  data: UpdateTaskInput,
) => {
  return await updateTask(id, organizationId, data);
};
export const deleteTaskService = async (id: number, organizationId: number) => {
  return await deleteTask(id, organizationId);
};
export const statusFilterService = async (
  status: TaskStatus,
  organizationId: number,
) => {
  return await statusFilter(status, organizationId);
};
export const priorityFilterService = async (
  priority: Priority,
  organizationId: number,
) => {
  return await priorityFilter(priority, organizationId);
};
export const assignUserToTaskService = async (
  taskId: number,
  userId: number,
  organizationId: number,
) => {
  return await assignUserToTask(taskId, userId, organizationId);
};
export const unassignUserFromTaskService = async (
  taskId: number,
  userId: number,
  organizationId: number,
) => {
  return await unassignUserFromTask(taskId, userId, organizationId);
};
export const filterTaskByAssigneeService = async (
  userId: number,
  organizationId: number,
) => {
  return await filterTaskByAssignee(userId, organizationId);
};
export const filterTaskByDueDateService = async (
  from: Date,
  to: Date,
  organizationId: number,
) => {
  return await filterTaskByDueDate(from, to, organizationId);
};
export const getTasksWithCursorService = async (
  organizationId: number,
  limit: number,
  cursor?: number,
) => {
  return await getTasksWithCursor(organizationId, limit, cursor);
};
export const getProjectDashboardService = async (
  projectId: number,
  organizationId: number,
) => {
  return await getProjectDashboard(projectId, organizationId);
};
export const bulkUpdateTaskStatusService = async (
  taskIds: number[],
  status: TaskStatus,
  organizationId: number,
) => {
  return await bulkUpdateTaskStatus(taskIds, status, organizationId);
};
