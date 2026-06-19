import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import programRoutes from "./routes/program.routes";
import sessionRoutes from "./routes/session.routes";
import uploadRoutes from "./routes/upload.routes";
import auditRoutes from "./routes/audit.routes";
import importRoutes from "./routes/import.routes";
import { requestIdMiddleware } from "./middlewares/request-id.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(errorMiddleware);
app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

// routes and its controllers
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api", sessionRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api", importRoutes);

export default app;
