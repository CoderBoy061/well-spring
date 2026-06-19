import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/password-reset/request", authController.requestPasswordReset);
router.post("/password-reset/confirm", authController.resetPassword);
router.get("/me", authenticate, (req, res) => {
  res.json({
    creatorId: req.creatorId,
  });
});

export default router;
