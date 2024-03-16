import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import { restApi } from "./libs"
import "reflect-metadata"

dotenv.config()

const { NODE_ENV = "dev", PORT = 3000, DB_HOST, DB_PORT } = process.env

AppDataSource.initialize().then(() => {
  console.log("Data source initialized")
  console.log(`** READY | Environment : ${NODE_ENV}`)
  console.log(`** READY | PostgresSQL at : ${DB_HOST}:${DB_PORT}`)

  restApi.listen(PORT!)
  console.log(`** READY | Rest API Server : ${PORT}`)
}).catch((error) => {
  console.error("Error initializing data source", error)
})
