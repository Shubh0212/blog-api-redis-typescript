import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let status = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err?.code === 11000) {
    status = 409;
    message = "Duplicate value already exists";
  } else if (err?.name === "CastError") {
    status = 400;
    message = "Invalid id";
  } else if (err?.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else {
    console.error(err); // log internally, never send the stack
  }

  res.status(status).json({ success: false, message });
};
