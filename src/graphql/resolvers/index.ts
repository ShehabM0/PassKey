import { userResolvers } from './user.ts'

const resolvers = {
  Query: {
    ...userResolvers.Query
  }
}

export { resolvers }