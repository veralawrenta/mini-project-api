import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const message = err.message || "Something Went Wrong!";
    const status = err.status || 500;
  res.status(500).send({ message: err.message });
};
