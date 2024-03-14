import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

dotenv.config()

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = header.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET!)
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  console.log(decode)

  // todo set current user
  // req.currentUser = decode;

  next()
}
