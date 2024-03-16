import express from "express"
import { FeeControllers } from "../controllers"
import { feePath } from "../constants"

const Router = express.Router()

Router.get(feePath.fee, FeeControllers.getAllFees)
Router.post(feePath.fee, FeeControllers.createFee)
Router.post(feePath.inquiry, FeeControllers.getAllFeesByPlateInfo)

export { Router as feeRouter }
