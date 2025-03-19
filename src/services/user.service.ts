import { MOCK_USERS } from "../../test/mock/users.mock"
import { User, userSchema } from "../types"
import { getConfig } from "../utils/config.util"

export type UserService = {
  getUsers: () => Promise<User[]>
}

export const createUserService = (): UserService => {
  const { USERS_ENDPOINT } = getConfig()

  const getUsers = async (): Promise<User[]> => {
    const response = await fetch(USERS_ENDPOINT)

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    const users = await response.json()

    return MOCK_USERS.map((user: any) => userSchema.parse(user))
  }
  return {
    getUsers,
  }
}
