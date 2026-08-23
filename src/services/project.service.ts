import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../repositories/project.repositories.ts";

interface CreateProjectInput {
  name: string;
  organizationId: number;
}

export const createProjectService = async ({
  name,
  organizationId,
}: CreateProjectInput) => {
  return await createProject(name, organizationId);
};

export const getProjectsService = async (organizationId: number) => {
  return await getProjects(organizationId);
};
export const updateProjectService = async (
  id: number,
  organizationId: number,
  name: string,
) => {
  return await updateProject(id, organizationId, name);
};

export const deleteProjectService = async (
  id: number,
  organizationId: number,
) => {
  return await deleteProject(id, organizationId);
};
