import { User } from "../entities"

export class UserResponse {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date
  updatedAt: Date

  constructor(user: User) {
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.role = user.role
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
