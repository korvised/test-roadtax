import express from "express"
import { PaymentControllers } from "../controllers"

const Router = express.Router()

Router.get("/payments", PaymentControllers.getAllPayments)
Router.post("/payments", PaymentControllers.createPayment)

export { Router as paymentRouter }
