import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "TaskFlow project management backend API",
    },

    servers: [
      {
        url: "https://backend-task-acdd.onrender.com",
        description: "Local server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Task not found",
            },
            code: {
              type: "string",
              example: "TASK_NOT_FOUND",
            },
            details: {
              type: "object",
              example: {},
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Vikash Kumar",
            },
            email: {
              type: "string",
              format: "email",
              example: "vikash@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password@123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "vikash@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password@123",
            },
          },
        },

        Project: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "TaskFlow Backend",
            },
            description: {
              type: "string",
              example: "Backend development project",
            },
          },
        },

        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            title: {
              type: "string",
              example: "Implement authentication",
            },
            description: {
              type: "string",
              example: "Implement JWT authentication",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "review", "done"],
              example: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              example: "high",
            },
          },
        },

        AssignTaskRequest: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: {
              type: "integer",
              example: 5,
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
