import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middlewares/req.middlewares.ts";
import { authRoutes } from "./routes/auth.route.ts";
import { projectRoutes } from "./routes/project.route.ts";
import { errorMiddleware } from "./middlewares/error.middleware.ts";

const app = express();

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
export default app;
