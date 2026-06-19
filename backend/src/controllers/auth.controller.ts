import { Request, Response } from "express";

import authService from "../services/auth.service";

class AuthController {
  signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const result = await authService.signup(name, email, password);

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({
        message: error.message,
      });
    }
  };

  requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const result = await authService.requestPasswordReset(email);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { resetToken, newPassword } = req.body;

      const result = await authService.resetPassword(resetToken, newPassword);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
}

export default new AuthController();
