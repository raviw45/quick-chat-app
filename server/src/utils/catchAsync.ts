import { NextFunction, Request, Response } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function catchAsync(fn: AsyncFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("❌ Error in catchAsync:", error);

      // Let express handle it if response already sent
      if (res.headersSent) return next(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
