import { STATUS_CODE } from "../constant/status.code.ts";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandle.ts";

import {
  assigneeFilterSchema,
  assignTaskSchema,
  bulkUpdateTaskStatusSchema,
  createTaskSchema,
  dueDateFilterSchema,
  priorityFilterSchema,
  taskFilterSchema,
  taskPaginationSchema,
  updateTaskSchema,
} from "../validators/task.validators.ts";

import {
  assignUserToTaskService,
  bulkUpdateTaskStatusService,
  createTaskService,
  deleteTaskService,
  filterTaskByAssigneeService,
  filterTaskByDueDateService,
  getProjectDashboardService,
  getTasksService,
  getTasksWithCursorService,
  priorityFilterService,
  statusFilterService,
  unassignUserFromTaskService,
  updateTaskService,
} from "../services/task.service.ts";

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Creates a task inside a project belonging to the authenticated user's organization.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implement authentication
 *               description:
 *                 type: string
 *                 example: Implement JWT authentication and refresh token flow
 *               projectId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, done]
 *                 example: todo
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-01T10:00:00Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Project not found
 */
export const taskController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const validate = createTaskSchema.parse(req.body);

    const task = await createTaskService({
      ...validate,
      organizationId,
    });

    return res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  },
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns all tasks belonging to the authenticated user's organization.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Organization not found
 */
export const getTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const tasks = await getTasksService(organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  },
);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     description: Updates a task belonging to the authenticated user's organization.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, done]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: urgent
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-10T10:00:00Z
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Task not found
 */
export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const validate = updateTaskSchema.parse(req.body);

    const task = await updateTaskService(id, organizationId, validate);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  },
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task belonging to the authenticated user's organization.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Task not found
 */
export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const task = await deleteTaskService(id, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  },
);

/**
 * @swagger
 * /tasks/filter/status:
 *   get:
 *     summary: Filter tasks by status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, review, done]
 *         example: in_progress
 *     responses:
 *       200:
 *         description: Tasks filtered successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Organization not found
 */
export const statusFilterController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const { status } = taskFilterSchema.parse(req.query);

    const tasks = await statusFilterService(status, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: tasks,
    });
  },
);

/**
 * @swagger
 * /tasks/filter/priority:
 *   get:
 *     summary: Filter tasks by priority
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: priority
 *         required: true
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         example: high
 *     responses:
 *       200:
 *         description: Tasks filtered successfully
 *       400:
 *         description: Invalid priority
 *       401:
 *         description: Organization not found
 */
export const priorityFilterController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const { priority } = priorityFilterSchema.parse(req.query);

    const tasks = await priorityFilterService(priority, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: tasks,
    });
  },
);

/**
 * @swagger
 * /tasks/{taskId}/assign:
 *   post:
 *     summary: Assign a user to a task
 *     description: Assigns an organization member to a task and creates an asynchronous email notification job.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: User assigned to task successfully
 *       400:
 *         description: Invalid request or user already assigned
 *       401:
 *         description: Organization not found
 *       403:
 *         description: User does not belong to organization
 *       404:
 *         description: Task not found
 */
export const assignUserToTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.taskId);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const { userId } = assignTaskSchema.parse(req.body);

    const assignment = await assignUserToTaskService(
      taskId,
      userId,
      organizationId,
    );

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "User assigned to task successfully",
      data: assignment,
    });
  },
);

/**
 * @swagger
 * /tasks/{taskId}/assign/{userId}:
 *   delete:
 *     summary: Unassign a user from a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: User unassigned from task successfully
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Assignment not found
 */
export const unassignUserFromTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.taskId);

    const userId = Number(req.params.userId);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const assignment = await unassignUserFromTaskService(
      taskId,
      userId,
      organizationId,
    );

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "User unassigned from task successfully",
      data: assignment,
    });
  },
);

/**
 * @swagger
 * /tasks/filter/assignee:
 *   get:
 *     summary: Filter tasks by assignee
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Tasks filtered by assignee
 *       401:
 *         description: Organization not found
 */
export const filterTaskByAssigneeController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const { userId } = assigneeFilterSchema.parse(req.query);

    const tasks = await filterTaskByAssigneeService(userId, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: tasks,
    });
  },
);

/**
 * @swagger
 * /tasks/filter/due-date:
 *   get:
 *     summary: Filter tasks by due date range
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-08-01
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-08-31
 *     responses:
 *       200:
 *         description: Tasks filtered by due date
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Organization not found
 */
export const filterTaskByDueDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const { from, to } = dueDateFilterSchema.parse(req.query);

    if (from > to) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        error: "Invalid date range",
        code: "INVALID_DATE_RANGE",
      });
    }

    const tasks = await filterTaskByDueDateService(from, to, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: tasks,
    });
  },
);

/**
 * @swagger
 * /tasks/cursor:
 *   get:
 *     summary: Get tasks using cursor pagination
 *     description: Returns paginated tasks using cursor-based pagination.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: string
 *         example: "20"
 *     responses:
 *       200:
 *         description: Paginated tasks
 *       400:
 *         description: Invalid pagination parameters
 *       401:
 *         description: Organization not found
 */
export const getTasksWithCursorController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const { limit, cursor } = taskPaginationSchema.parse(req.query);

    const tasks = await getTasksWithCursorService(
      organizationId,
      limit,
      cursor,
    );

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      ...tasks,
    });
  },
);

/**
 * @swagger
 * /projects/{id}/dashboard:
 *   get:
 *     summary: Get project dashboard
 *     description: Returns task counts grouped by status for a project.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Project dashboard fetched successfully
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Project not found
 */
export const getProjectDashboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const dashboard = await getProjectDashboardService(
      projectId,
      organizationId,
    );

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: dashboard,
    });
  },
);

/**
 * @swagger
 * /tasks/bulk-status:
 *   patch:
 *     summary: Bulk update task status
 *     description: Updates the status of multiple tasks belonging to the authenticated user's organization.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskIds
 *               - status
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, done]
 *                 example: done
 *     responses:
 *       200:
 *         description: Tasks status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Organization not found
 */
export const bulkUpdateTaskStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Organization not found",
        code: "ORG_NOT_FOUND",
      });
    }

    const { taskIds, status } = bulkUpdateTaskStatusSchema.parse(req.body);

    const result = await bulkUpdateTaskStatusService(
      taskIds,
      status,
      organizationId,
    );

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Tasks status updated successfully",
      data: result,
    });
  },
);
