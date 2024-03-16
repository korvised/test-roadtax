import cache from "memory-cache"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities"
import { encrypt } from "../helpers"
import { ApiResponse, errorHandler } from "../middlewares"
import { HTTPStatusCode } from "../constants"

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

      // userRepository.create({ Name, email, password });
      const token = encrypt.generateToken({ id: user.id })

      return new ApiResponse(res, HTTPStatusCode.Ok).success({ token, user })
    } catch (err) {
      errorHandler(err, req, res, next)
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = cache.get("data")
      if (data) {
        return new ApiResponse(res, HTTPStatusCode.Ok).success(data, "Get users successfully")
      } else {
        const userRepository = AppDataSource.getRepository(User)
        const users = await userRepository.find()

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

      user.name = name
      user.email = email
      await userRepository.save(user)
      return new ApiResponse(res, HTTPStatusCode.Ok).success(user, "Update user successfully")
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
