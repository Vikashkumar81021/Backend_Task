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
