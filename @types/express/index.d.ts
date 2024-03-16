import { User } from "../../src/entities"
import { JwtPayload } from "jsonwebtoken"

type CurrentUser = Partial<JwtPayload> & Partial<User>

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser
    }
  }
}
