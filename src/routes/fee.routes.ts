import express from "express"
import { FeeControllers } from "../controllers"
import { feePath, Role } from "../constants"
import { authentication, authorization } from "../middlewares"

const Router = express.Router()

Router.post(feePath.inquiry, FeeControllers.getAllFeesByPlateInfo)
Router.get(
  feePath.fee,
  authentication,
  authorization([Role.ADMIN]),
  FeeControllers.getAllFees
)
Router.post(
  feePath.fee,
  authentication,
  authorization([Role.ADMIN]),
  FeeControllers.createFee
)
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
