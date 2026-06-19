import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import sessionController from "../controllers/session.controller";

const router = Router();

router.use(authenticate);

router.post("/programs/:programId/sessions", sessionController.createSession);

router.get("/programs/:programId/sessions", sessionController.getSessions);

router.put("/sessions/:id", sessionController.updateSession);

router.delete("/sessions/:id", sessionController.deleteSession);
router.patch("/programs/:programId/reorder", sessionController.reorderSessions);

export default router;
