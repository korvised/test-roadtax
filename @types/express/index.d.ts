import { JwtPayload } from "jsonwebtoken"
import { User } from "../../src/entities"

type CurrentUser = Partial<JwtPayload> & Partial<User>

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser
    }
  }
}
