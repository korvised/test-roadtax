import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities"
import { encrypt } from "../helpers"
import { ApiResponse, errorHandler } from "../middlewares"
import { HTTPStatusCode } from "../constants"

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return new ApiResponse(res, HTTPStatusCode.BadRequest).error("Email and password are required")

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { email } })

      if (!user) return new ApiResponse(res, HTTPStatusCode.NotFound).error("User not found")

      const isPasswordValid = encrypt.comparepassword(user?.password, password)
      if (!user || !isPasswordValid) {
        return new ApiResponse(res, HTTPStatusCode.BadRequest).error("Invalid email or password")
      }
      const token = encrypt.generateToken({ id: user.id })

      return new ApiResponse(res, HTTPStatusCode.Ok).success({ token })
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async getProfile(req: Request, res: Response, _next: NextFunction) {
    if (!req?.currentUser) {
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")
    }
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({
      where: { id: req.currentUser.id }
    })
    return new ApiResponse(res, HTTPStatusCode.Ok).success(user)
  }
}
