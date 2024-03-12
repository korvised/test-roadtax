import express from "express"
import { authentification, authorization } from "../middlewares"
import { MovieController } from "../controllers"

const Router = express.Router()

Router.get("/movies", authentification, MovieController.getAllMovies)
Router.post("/movies", authentification, MovieController.createMovie)

Router.put(
  "/movies/:id",
  authentification,
  authorization(["admin"]),
  MovieController.updateMovie
)
Router.delete(
  "/movies/:id",
  authentification,
  authorization(["admin"]),
  MovieController.deleteMovie
)
export { Router as movieRouter }
