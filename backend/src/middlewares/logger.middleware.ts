import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  const requestId =
    (req.headers["x-request-id"] as string | undefined) ||
    (req.headers["x-correlation-id"] as string | undefined) ||
    randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  res.on("finish", () => {
    logger.info({
      requestId,
      creatorId: req.creatorId || null,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
    });
  });

  next();
};
