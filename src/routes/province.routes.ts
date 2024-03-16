import express from "express"
import { authentification, authorization } from "../middlewares"
import { ProvinceControllers } from "../controllers"
import { provincePath, Role } from "../constants"

const Router = express.Router()

Router.get(provincePath.province, ProvinceControllers.getAllProvinces)
Router.post(provincePath.province, ProvinceControllers.createProvince)

Router.put(
  provincePath.province + "/:id",
  authentification,
  authorization([Role.ADMIN]),
  ProvinceControllers.updateProvince
)
Router.delete(
  provincePath.province + "/:id",
  authentification,
  authorization([Role.ADMIN]),
  ProvinceControllers.deleteProvince
)
export { Router as provinceRouter }
