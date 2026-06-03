import type { Request, Response, NextFunction } from "express";
import { validateInitData, type ValidatedInitData } from "../auth/validateInitData.js";

declare global {
  namespace Express {
    interface Request {
      tma?: ValidatedInitData;
    }
  }
}

export function tmaAuth(botToken: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("tma ")) {
      res.status(401).json({ error: "Missing Authorization: tma <initData>" });
      return;
    }
    const initData = header.slice(4).trim();
    try {
      req.tma = validateInitData(initData, botToken);
      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unauthorized";
      res.status(401).json({ error: message });
    }
  };
}
