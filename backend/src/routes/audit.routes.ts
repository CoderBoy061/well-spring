import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import auditController from "../controllers/audit.controller";

const router = Router();

router.use(authenticate);

router.get("/", auditController.getLogs);

export default router;
