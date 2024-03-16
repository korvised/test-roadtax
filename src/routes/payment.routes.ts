import express from "express"
import { PaymentControllers } from "../controllers"
import { paymentPath } from "../constants"

const Router = express.Router()

Router.get(paymentPath.payment, PaymentControllers.getAllPayments)
Router.post(paymentPath.payment, PaymentControllers.createPayment)

export { Router as paymentRouter }
