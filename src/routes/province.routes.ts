import express from "express"
import { authentification, authorization } from "../middlewares"
import { ProvinceControllers } from "../controllers"

const Router = express.Router()

Router.get("/provinces", ProvinceControllers.getAllProvinces)
Router.post("/provinces", ProvinceControllers.createProvince)

Router.put(
  "/provinces/:id",
  authentification,
  authorization(["admin"]),
  ProvinceControllers.updateProvince
)
Router.delete(
  "/provinces/:id",
  authentification,
  authorization(["admin"]),
  ProvinceControllers.deleteProvince
)
export { Router as provinceRouter }
