import prisma from "../config/database.ts";
import { Priority, TaskStatus } from "../generated/prisma/enums.ts";
import { emailQueue } from "../queues/email.queue.ts";

export const createTask = async (
  title: string,
  description: string | undefined,
  status: "todo" | "in_progress" | "review" | "done",
  priority: "low" | "medium" | "high" | "urgent",
  dueDate: Date | undefined,
  projectId: number,
  organizationId: number,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
    },
  });
};
export const getTasks = async (organizationId: number) => {
  return prisma.task.findMany({
    where: {
      project: {
        organizationId,
      },
    },
  });
};
export const updateTask = async (
  id: number,
  organizationId: number,
  data: {
    title?: string;
    description?: string;
    status?: "todo" | "in_progress" | "review" | "done";
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: Date;
  },
) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        organizationId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return await prisma.task.update({
    where: {
      id,
    },
    data,
  });
};
export const deleteTask = async (id: number, organizationId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        organizationId,
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return await prisma.task.delete({
    where: {
      id,
    },
  });
};
export const statusFilter = async (
  status: TaskStatus,
  organizationId: number,
) => {
  return await prisma.task.findMany({
    where: {
      status,
      project: {
        organizationId,
      },
    },
  });
};
export const priorityFilter = async (
  priority: Priority,
  organizationId: number,
) => {
  return await prisma.task.findMany({
    where: {
      priority,
      project: {
        organizationId,
      },
    },
  });
};

export const assignUserToTask = async (
  taskId: number,
  userId: number,
  organizationId: number,
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
      },
    },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const member = await prisma.orgMember.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!member) {
    throw new Error("USER_NOT_IN_ORGANIZATION");
  }
  const existingAssignment = await prisma.taskAssignment.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("TASK_USER_ALREADY_ASSIGNED");
  }

  return await prisma.taskAssignment.create({
    data: {
      taskId,
      userId,
    },
  });
};
export const unassignUserFromTask = async (
  taskId: number,
  userId: number,
  organizationId: number,
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
      },
    },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }
  const assignment = await prisma.taskAssignment.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  if (!assignment) {
    throw new Error("ASSIGNMENT_NOT_FOUND");
  }

  return await prisma.taskAssignment.delete({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });
};
export const filterTaskByAssignee = async (
  userId: number,
  organizationId: number,
) => {
  return await prisma.task.findMany({
    where: {
      assignments: {
        some: {
          userId,
        },
      },
      project: {
        organizationId,
      },
    },
  });
};
export const filterTaskByDueDate = async (
  from: Date,
  to: Date,
  organizationId: number,
) => {
  return await prisma.task.findMany({
    where: {
      dueDate: {
        gte: from,
        lte: to,
      },
      project: {
        organizationId,
      },
    },
  });
};
export const getTasksWithCursor = async (
  organizationId: number,
  limit: number,
  cursor?: number,
) => {
  const tasks = await prisma.task.findMany({
    where: {
      project: {
        organizationId,
      },
    },
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    orderBy: {
      id: "asc",
    },
  });

  const hasNextPage = tasks.length > limit;

  if (hasNextPage) {
    tasks.pop();
  }

  const nextCursor =
    hasNextPage && tasks.length > 0 ? tasks[tasks.length - 1].id : null;

  return {
    data: tasks,
    next_cursor: nextCursor,
  };
};
export const getProjectDashboard = async (
  projectId: number,
  organizationId: number,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const taskCounts = await prisma.task.groupBy({
    by: ["status"],
    where: {
      projectId,
    },
    _count: {
      _all: true,
    },
  });

  return taskCounts;
};
export const bulkUpdateTaskStatus = async (
  taskIds: number[],
  status: TaskStatus,
  organizationId: number,
) => {
  const tasks = await prisma.task.findMany({
    where: {
      id: {
        in: taskIds,
      },
      project: {
        organizationId,
      },
    },
    select: {
      id: true,
    },
  });

  if (tasks.length !== taskIds.length) {
    throw new Error("One or more tasks not found");
  }

  return await prisma.task.updateMany({
    where: {
      id: {
        in: taskIds,
      },
    },
    data: {
      status,
    },
  });
};

export const assignUserToTaskMail = async (
  taskId: number,
  userId: number,
  organizationId: number,
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
      },
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const member = await prisma.orgMember.findFirst({
    where: {
      userId,
      organizationId,
    },
    include: {
      user: true,
    },
  });

  if (!member) {
    throw new Error("USER_NOT_IN_ORGANIZATION");
  }

  const existingAssignment = await prisma.taskAssignment.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("TASK_USER_ALREADY_ASSIGNED");
  }

  const result = await prisma.$transaction(async (tx) => {
    const assignment = await tx.taskAssignment.create({
      data: {
        taskId,
        userId,
      },
    });

    const outboxEvent = await tx.outboxEvent.create({
      data: {
        type: "TASK_ASSIGNED",
        payload: {
          taskId,
          userId,
          organizationId,
          userEmail: member.user.email,
          taskTitle: task.title,
        },
      },
    });

    return {
      assignment,
      outboxEvent,
    };
  });

  const jobId = `outbox-${result.outboxEvent.id}`;

  try {
    await emailQueue.add(result.outboxEvent.type, result.outboxEvent.payload, {
      jobId,
    });

    await prisma.outboxEvent.update({
      where: {
        id: result.outboxEvent.id,
      },
      data: {
        processed: true,
        jobId,
      },
    });

    return {
      assignment: result.assignment,
      jobId,
    };
  } catch (error) {
    await prisma.$transaction(async (tx) => {
      await tx.taskAssignment.delete({
        where: {
          id: result.assignment.id,
        },
      });

      await tx.outboxEvent.delete({
        where: {
          id: result.outboxEvent.id,
        },
      });
    });

    throw new Error("NOTIFICATION_JOB_ENQUEUE_FAILED");
  }
};
