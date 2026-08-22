import express from "express";
import helmet from "helmet";
import { reqLogger } from "./middlewares/req.middlewares.ts";

const app = express();

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);
app.use(reqLogger);
export default app;
