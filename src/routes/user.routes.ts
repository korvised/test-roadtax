import express from "express"
import { AuthController, UserController } from "../controllers"
import { authentification, authorization } from "../middlewares"
import { Role, userPath } from "../constants"

const Router = express.Router()

Router.get(
  userPath.user,
  authentification,
  authorization([Role.ADMIN]),
  UserController.getUsers
)
Router.get(
  userPath.profile,
  authentification,
  authorization([Role.ADMIN, Role.EMPLOYEE]),
  AuthController.getProfile
)
Router.post(userPath.signup, UserController.signup)
Router.post(userPath.signup, AuthController.login)
Router.put(
  userPath.user + "/:id",
  authentification,
  authorization([Role.ADMIN, Role.EMPLOYEE]),
  UserController.updateUser
)
Router.delete(
  userPath.user + "/:id",
  authentification,
  authorization([Role.ADMIN]),
  UserController.deleteUser
)
export { Router as userRouter }
