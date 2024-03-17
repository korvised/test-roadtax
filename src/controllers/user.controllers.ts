import cache from "memory-cache"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { encrypt } from "../libs"
import { User } from "../entities"
import { ApiResponse, errorHandler } from "../middlewares"
import { HTTPStatusCode } from "../constants"
import { UserResponse } from "../helpers"

export class UserController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body
      const encryptedPassword = await encrypt.encryptpass(password)
      const user = new User()
      user.name = name
      user.email = email
      user.password = encryptedPassword
      if (role) user.role = role

      const userRepository = AppDataSource.getRepository(User)
      await userRepository.save(user)

      const token = encrypt.generateToken({ id: user.id })
      const authUser = new UserResponse(user)

      return new ApiResponse(res, HTTPStatusCode.Ok).success({ token, user: authUser })
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async signin(req: Request, res: Response, next: NextFunction) {
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
      const authUser = new UserResponse(user)

      return new ApiResponse(res, HTTPStatusCode.Ok).success({ token, user: authUser })
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async getProfile(req: Request, res: Response, _next: NextFunction) {
    if (!req?.currentUser) {
      return new ApiResponse(res, HTTPStatusCode.Unauthorized).error("Unauthorized")
    }

    return new ApiResponse(res, HTTPStatusCode.Ok).success(req.currentUser)
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = cache.get("data")
      if (data) {
        return new ApiResponse(res, HTTPStatusCode.Ok).success(data, "Get users successfully")
      } else {
        const userRepository = AppDataSource.getRepository(User)
        const users = await userRepository.find({
          select: ["id", "name", "email", "role", "createdAt", "updatedAt"]
        })

        cache.put("data", users, 6000)
        return new ApiResponse(res, HTTPStatusCode.Ok).success(users, "Get users successfully")
      }
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { name, email } = req.body
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({
        where: { id }
      })

      if (!user) return new ApiResponse(res, HTTPStatusCode.NotFound).error("User not found")

      user.email = email
      user.name = name
      await userRepository.save(user)
      const authUser = new UserResponse(user)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(authUser, "Update user successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({
        where: { id }
      })

      if (!user) return new ApiResponse(res, HTTPStatusCode.NotFound).error("User not found")

      await userRepository.remove(user)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(user, "Delete user successfully")
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }
}
