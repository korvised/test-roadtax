import "reflect-metadata"
import { DataSource } from "typeorm"

import * as dotenv from "dotenv"
import { Movie, User } from "./entities"

dotenv.config()

const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
  process.env

export const AppDataSource = new DataSource({


  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: NODE_ENV === "dev" ? false : false,
  //logging logs sql command on the terminal
  logging: NODE_ENV === "dev" ? false : false,
  entities: [User, Movie],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: []
})
