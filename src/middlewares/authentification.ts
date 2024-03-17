import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"
import { ApiResponse } from "./apiResponse"
import { HTTPStatusCode } from "../constants"
import { AppDataSource } from "../data-source"
import { User } from "../entities"
import { errorHandler } from "./errorHandler"
import { UserResponse } from "../helpers"

dotenv.config()

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization
    if (!header) {
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")
    }

    const token = header.split(" ")[1]
    if (!token) {
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!)
    if (!decode) {
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")
    }

    const userId = (decode as { id?: string })?.id
    if (!userId)
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({
      select: ["id", "name", "email", "role", "createdAt", "updatedAt"],
      where: { id: userId }
    })

    if (!user) return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")

    const authUser = new UserResponse(user)
    req.currentUser = { ...authUser, ...req.currentUser }

    next()
  } catch (err) {
    errorHandler(err, req, res, next)
  }
}
