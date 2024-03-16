import cors from "cors"
import express, { Request, Response } from "express"
import morgan from "morgan"
import { ApiResponse, errorHandler } from "../middlewares"
import { feeRouter, paymentRouter, provinceRouter, userRouter } from "../routes"
import { HTTPStatusCode } from "../constants"

const app = express()

// Apply middlewares
app.use(express.json(), express.urlencoded({ extended: true, limit: "25mb" }))
app.use(cors())
app.use(morgan("dev"))
app.use(errorHandler)

// Register routes
app.use(userRouter, feeRouter, paymentRouter, provinceRouter)

// Handle 404
app.get("*", (_req: Request, res: Response) => {
  return new ApiResponse(res, HTTPStatusCode.NotFound).error("Path not found")
})

export default app

