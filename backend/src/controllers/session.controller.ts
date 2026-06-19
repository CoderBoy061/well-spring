import { Request, Response } from "express";

import sessionService from "../services/session.service";

class SessionController {
  createSession = async (req: Request, res: Response) => {
    try {
      const session = await sessionService.createSession(
        req.creatorId!,
        req.params.programId as string,
        req.body,
      );

      return res.status(201).json(session);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

  getSessions = async (req: Request, res: Response) => {
    const sessions = await sessionService.getSessions(
      req.creatorId!,
      req.params.programId as string,
    );

    return res.json(sessions);
  };

  updateSession = async (req: Request, res: Response) => {
    try {
      const session = await sessionService.updateSession(
        req.creatorId!,
        req.params.id as string,
        req.body,
      );

      return res.json(session);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  };

  deleteSession = async (req: Request, res: Response) => {
    try {
      await sessionService.deleteSession(
        req.creatorId!,
        req.params.id as string,
      );

      return res.json({
        success: true,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  };
  reorderSessions = async (req: Request, res: Response) => {
    try {
      await sessionService.reorderSessions(
        req.creatorId!,
        req.params.programId as string,
        req.body.sessionIds,
      );

      return res.json({
        success: true,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
}

export default new SessionController();
