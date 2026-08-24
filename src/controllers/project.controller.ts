import { STATUS_CODE } from "../constant/status.code.ts";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandle.ts";

import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validators.ts";

import {
  createProjectService,
  deleteProjectService,
  getProjectsService,
  updateProjectService,
} from "../services/project.service.ts";

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a project
 *     description: Creates a project inside the authenticated user's organization.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: TaskFlow Backend
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Organization not found
 */
export const projectController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const validate = createProjectSchema.parse(req.body);

    const project = await createProjectService({
      name: validate.name,
      organizationId,
    });

    return res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  },
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     description: Returns all projects belonging to the authenticated user's organization.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       401:
 *         description: Organization not found
 */
export const getProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const projects = await getProjectsService(organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  },
);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     description: Updates a project belonging to the authenticated user's organization.
 *     tags: [Projects]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated TaskFlow Project
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Organization not found
 *       404:
 *         description: Project not found
 */
export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    const id = Number(req.params.id);

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const { name } = updateProjectSchema.parse(req.body);

    const updatedProject = await updateProjectService(id, organizationId, name);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  },
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Deletes a project belonging to the authenticated user's organization. Admin authorization should be enforced by middleware.
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *       401:
 *         description: Organization not found
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */
export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Organization not found",
      });
    }

    const deleteProject = await deleteProjectService(id, organizationId);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Project deleted successfully",
      data: deleteProject,
    });
  },
);
