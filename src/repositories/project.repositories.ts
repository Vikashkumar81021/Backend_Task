import prisma from "../config/database.ts";

export const createProject = async (name: string, organizationId: number) => {
  return await prisma.project.create({
    data: {
      name,
      organizationId,
    },
  });
};
export const getProjects = async (organizationId: number) => {
  return await prisma.project.findMany({
    where: {
      organizationId,
    },
  });
};

export const updateProject = async (
  id: number,
  organizationId: number,
  name: string,
) => {
  const result = await prisma.project.updateMany({
    where: {
      id,
      organizationId,
    },
    data: {
      name,
    },
  });

  if (result.count === 0) {
    throw new Error("Project not found");
  }

  return prisma.project.findUnique({
    where: {
      id,
    },
  });
};

export const deleteProject = async (id: number, organizationId: number) => {
  const project = await prisma.project.findFirst({
    where: {
      id,
      organizationId,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.tasks.length > 0) {
    const error = new Error("Project has tasks and cannot be deleted");

    (error as any).code = "PROJECT_HAS_TASKS";
    (error as any).statusCode = 409;

    throw error;
  }

  return await prisma.project.delete({
    where: {
      id,
    },
  });
};
