import pino from "pino";
import requestContext from "./request-context";

const isProduction = process.env.NODE_ENV === "production";
const transport = isProduction
  ? undefined
  : {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    };

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(transport ? { transport } : {}),
  base: {
    pid: false,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin() {
    // include dynamic per-request fields when available
    try {
      const ctx = requestContext.getContext();
      return {
        requestId: ctx.requestId || null,
        creatorId: ctx.creatorId || null,
      };
    } catch (e) {
      return {};
    }
  },
});
