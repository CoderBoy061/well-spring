import requestContext from "../config/request-context";

import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      creatorId?: string;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.creatorId = decoded.creatorId;
    // attach creatorId to the current request context for logging
    try {
      requestContext.setCreatorId(decoded.creatorId);
    } catch (e) {
      // ignore if no context is present
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
