import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import requestContext from "../config/request-context";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = randomUUID();
  req.requestId = id;

  // initialize async request context for downstream logging
  requestContext.runWithContext({ requestId: id, creatorId: null }, () => {
    next();
  });
};
