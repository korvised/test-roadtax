import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { ApiResponse, errorHandler } from "./middlewares"
import { feeRouter, paymentRouter, provinceRouter, userRouter } from "./routes"
import "reflect-metadata"

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))
app.use(errorHandler)

const { PORT = 3000 } = process.env

app.use("/auth", userRouter)
app.use("/api", feeRouter)
app.use("/api", paymentRouter)
app.use("/api", provinceRouter)

app.get("*", (_req: Request, res: Response) => {
  return new ApiResponse(res, 404).error("Bad Request")
})

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT)
    })
    console.log("Data Source has been initialized!")
  })
  .catch((error) => console.log(error))
