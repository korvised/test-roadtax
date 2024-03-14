import cache from "memory-cache"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities"
import { encrypt } from "../helpers"

export class UserController {
  static async signup(req: Request, res: Response) {
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

      return res
        .status(200)
        .json({ message: "User created successfully", token, user })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async getUsers(_req: Request, res: Response) {
    try {
      const data = cache.get("data")
      if (data) {
        console.log("serving from cache")
        return res.status(200).json({
          data
        })
      } else {
        console.log("serving from db")
        const userRepository = AppDataSource.getRepository(User)
        const users = await userRepository.find()

        cache.put("data", users, 6000)
        return res.status(200).json({
          data: users
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email } = req.body
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({
        where: { id }
      })

      if (!user) return res.status(404).json({ message: "User not found" })

      user.name = name
      user.email = email
      await userRepository.save(user)
      res.status(200).json({ message: "udpdate", user })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({
        where: { id }
      })

      if (!user) return res.status(404).json({ message: "User not found" })

      await userRepository.remove(user)
      res.status(200).json({ message: "ok" })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}
