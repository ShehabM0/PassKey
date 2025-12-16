import { userResolvers } from './user.ts'

const resolvers = {
  Query: {
    ...userResolvers.Query
  },
  User: {
    ...userResolvers.User
  }
}

export { resolvers }