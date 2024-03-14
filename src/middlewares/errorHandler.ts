import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "./apiResponse"
import { httpException } from "../helpers"

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode, message } = httpException(error)

  return new ApiResponse(res, statusCode).error(message)
}
