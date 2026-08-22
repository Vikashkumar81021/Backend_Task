import express from "express";
import helmet from "helmet";

const app = express();

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);

export default app;
