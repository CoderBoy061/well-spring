import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import programController from "../controllers/program.controller";

const router = Router();

router.use(authenticate);

router.post("/", programController.createProgram);

router.get("/", programController.getPrograms);

router.get("/:id", programController.getProgramById);

router.put("/:id", programController.updateProgram);

router.delete("/:id", programController.deleteProgram);

export default router;
