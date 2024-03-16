import express from "express"
import { UserController } from "../controllers"
import { authentication, authorization } from "../middlewares"
import { Role, userPath } from "../constants"

const Router = express.Router()

Router.get(
  userPath.user,
  authentication,
  authorization([Role.ADMIN]),
  UserController.getUsers
)
Router.get(
  userPath.profile,
  authentication,
  UserController.getProfile
)
Router.post(userPath.signup, UserController.signup)
Router.post(userPath.signin, UserController.signin)
Router.put(
  userPath.user + "/:id",
  authentication,
  authorization([Role.ADMIN, Role.EMPLOYEE]),
  UserController.updateUser
)
Router.delete(
  userPath.user + "/:id",
  authentication,
  authorization([Role.ADMIN]),
  UserController.deleteUser
)
export { Router as userRouter }
