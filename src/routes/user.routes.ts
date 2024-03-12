import express from "express"
import { AuthController, UserController } from "../controllers"
import { authentification, authorization } from "../middlewares"

const Router = express.Router()

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  UserController.getUsers
)
Router.get(
  "/profile",
  authentification,
  authorization(["user", "admin"]),
  AuthController.getProfile
)
Router.post("/signup", UserController.signup)
Router.post("/login", AuthController.login)
Router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]),
  UserController.updateUser
)
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  UserController.deleteUser
)
export { Router as userRouter }
