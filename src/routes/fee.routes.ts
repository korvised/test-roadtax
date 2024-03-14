import express from "express"
import { FeeControllers } from "../controllers"

const Router = express.Router()

Router.get("/fees", FeeControllers.getAllFees)
Router.post("/fees", FeeControllers.createFee)
Router.post("/inquiry", FeeControllers.getAllFeesByPlateInfo)

export { Router as feeRouter }
