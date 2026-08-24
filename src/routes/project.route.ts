import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import {
  deleteProjectController,
  getProjectsController,
  projectController,
  updateProjectController,
} from "../controllers/project.controller.ts";
import { requireRole } from "../middlewares/role.middleware.ts";

const projectRoutes = Router();
projectRoutes.post("/", authMiddleware, projectController);
projectRoutes.get("/", authMiddleware, getProjectsController);
projectRoutes.patch("/:id", authMiddleware, updateProjectController);
projectRoutes.delete(
  "/:id",
  authMiddleware,
  requireRole("org_admin"),
  deleteProjectController,
);
export { projectRoutes };
