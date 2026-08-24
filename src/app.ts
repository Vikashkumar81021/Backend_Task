import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middlewares/req.middlewares.ts";
import { authRoutes } from "./routes/auth.route.ts";
import { projectRoutes } from "./routes/project.route.ts";
import { taskRoutes } from "./routes/task.route.ts";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";
const app = express();

app.use(
  cors({
    origin: ["https://backend-task-acdd.onrender.com"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);
app.use(reqLogger);
app.use(errorMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
export default app;
