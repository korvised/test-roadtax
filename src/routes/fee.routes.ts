import express from "express"
import { FeeControllers } from "../controllers"
import { feePath, Role } from "../constants"
import { authentication, authorization } from "../middlewares"

const Router = express.Router()

Router.get(feePath.fee, FeeControllers.getAllFees)
Router.post(feePath.fee, FeeControllers.createFee)
Router.post(feePath.inquiry, FeeControllers.getAllFeesByPlateInfo)
Router.put(
  feePath.inquiry + "/:id",
  FeeControllers.updateFee,
  authentication,
  authorization([Role.ADMIN])
)
Router.delete(
  feePath.fee + "/:id",
  FeeControllers.deleteFee,
  authentication,
  authorization([Role.ADMIN])
)

export { Router as feeRouter }
