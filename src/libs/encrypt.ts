import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config()

const { JWT_SECRET = "", JWT_EXP = "1d" } = process.env

export default class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12)
  }

  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword)
  }

  static generateToken(payload: Record<string, any>) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP })
  }
}
