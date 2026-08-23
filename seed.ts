import {
  OrgRole,
  TaskStatus,
  Priority,
} from "./src/generated/prisma/client.ts";

import prisma from "./src/config/database.ts";
import bcrypt from "bcrypt";
async function main() {
  const password = await bcrypt.hash("user@123", 12);

  // USERS
  const user1 = await prisma.user.create({
    data: {
      name: "Vikash",
      email: "vikash@gmail.com",
      password,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Rahul",
      email: "rahul@gmail.com",
      password,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Amit",
      email: "amit@gmail.com",
      password,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "Rohan",
      email: "rohan@gmail.com.com",
      password,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      name: "shashi",
      email: "shashi@gmail.com",
      password,
    },
  });

  // ORGANIZATIONS

  const organization1 = await prisma.organization.create({
    data: {
      orgName: "TaskFlow Technologies",
    },
  });

  const organization2 = await prisma.organization.create({
    data: {
      orgName: "SEST INFOTECH PVT LTD",
    },
  });

  // ORGANIZATION MEMBERS

  await prisma.orgMember.createMany({
    data: [
      {
        userId: user1.id,
        organizationId: organization1.id,
        role: OrgRole.org_admin,
      },
      {
        userId: user2.id,
        organizationId: organization1.id,
        role: OrgRole.member,
      },
      {
        userId: user3.id,
        organizationId: organization1.id,
        role: OrgRole.member,
      },
      {
        userId: user4.id,
        organizationId: organization2.id,
        role: OrgRole.org_admin,
      },
      {
        userId: user5.id,
        organizationId: organization2.id,
        role: OrgRole.member,
      },
    ],
  });

  // PROJECTS

  const project1 = await prisma.project.create({
    data: {
      name: "TaskFlow Backend",
      organizationId: organization1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "TaskFlow Frontend",
      organizationId: organization1.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Mobile Application",
      organizationId: organization1.id,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: "LMS",
      organizationId: organization2.id,
    },
  });

  // TASKS

  const task1 = await prisma.task.create({
    data: {
      title: "Setup PostgreSQL",
      description: "Configure PostgreSQL database",
      status: TaskStatus.done,
      priority: Priority.high,
      projectId: project1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Setup Prisma",
      description: "Configure Prisma ORM",
      status: TaskStatus.done,
      priority: Priority.high,
      projectId: project1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Implement Authentication",
      description: "Implement JWT authentication",
      status: TaskStatus.in_progress,
      priority: Priority.urgent,
      projectId: project1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "Implement Authorization",
      description: "Implement organization RBAC",
      status: TaskStatus.todo,
      priority: Priority.high,
      projectId: project1.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: "Create Dashboard",
      description: "Create project dashboard",
      status: TaskStatus.review,
      priority: Priority.medium,
      projectId: project2.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: "Create Login Page",
      description: "Build login UI",
      status: TaskStatus.done,
      priority: Priority.high,
      projectId: project2.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: "Create Task Page",
      description: "Build task management UI",
      status: TaskStatus.in_progress,
      priority: Priority.medium,
      projectId: project2.id,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: "Setup DevOps",
      description: "Setup DevOps",
      status: TaskStatus.todo,
      priority: Priority.low,
      projectId: project3.id,
    },
  });

  const task9 = await prisma.task.create({
    data: {
      title: "Implement Push Notifications",
      description: "Setup mobile push notifications",
      status: TaskStatus.todo,
      priority: Priority.high,
      projectId: project3.id,
    },
  });

  const task10 = await prisma.task.create({
    data: {
      title: "Create Customer Module",
      description: "Implement CRM customer module",
      status: TaskStatus.in_progress,
      priority: Priority.high,
      projectId: project4.id,
    },
  });

  const task11 = await prisma.task.create({
    data: {
      title: "Create CRM Dashboard",
      description: "Create CRM dashboard",
      status: TaskStatus.review,
      priority: Priority.medium,
      projectId: project4.id,
    },
  });

  const task12 = await prisma.task.create({
    data: {
      title: "Add Customer Search",
      description: "Implement customer search",
      status: TaskStatus.todo,
      priority: Priority.low,
      projectId: project4.id,
    },
  });

  // TASK ASSIGNMENTS

  await prisma.taskAssignment.createMany({
    data: [
      {
        taskId: task1.id,
        userId: user1.id,
      },
      {
        taskId: task2.id,
        userId: user2.id,
      },
      {
        taskId: task3.id,
        userId: user2.id,
      },
      {
        taskId: task4.id,
        userId: user3.id,
      },
      {
        taskId: task5.id,
        userId: user1.id,
      },
      {
        taskId: task6.id,
        userId: user2.id,
      },
      {
        taskId: task7.id,
        userId: user3.id,
      },
      {
        taskId: task8.id,
        userId: user3.id,
      },
      {
        taskId: task9.id,
        userId: user1.id,
      },
      {
        taskId: task10.id,
        userId: user4.id,
      },
      {
        taskId: task11.id,
        userId: user5.id,
      },
      {
        taskId: task12.id,
        userId: user5.id,
      },
    ],
  });

  // COMMENTS
  await prisma.comment.createMany({
    data: [
      {
        content: "Database setup is completed.",
        taskId: task1.id,
        userId: user1.id,
      },
      {
        content: "Prisma configuration looks good.",
        taskId: task2.id,
        userId: user2.id,
      },
      {
        content: "JWT implementation is in progress.",
        taskId: task3.id,
        userId: user2.id,
      },
      {
        content: "Please review the authorization flow.",
        taskId: task4.id,
        userId: user3.id,
      },
      {
        content: "Dashboard is ready for review.",
        taskId: task5.id,
        userId: user1.id,
      },
      {
        content: "Login page has been completed.",
        taskId: task6.id,
        userId: user2.id,
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
