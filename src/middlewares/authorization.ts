import { NextFunction, Request, Response } from "express"
import { HTTPStatusCode } from "../constants"
import { ApiResponse } from "./apiResponse"

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")

    if (!roles.includes(req.currentUser?.role!))
      return new ApiResponse(res, HTTPStatusCode.Forbidden)
        .error("Permission denied", "You don't have permission to access this resource")

    next()
  }
}
