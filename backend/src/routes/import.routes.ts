import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

import importController from "../controllers/import.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/programs/:programId/import",
  upload.single("file"),
  importController.importSessions,
);

export default router;
