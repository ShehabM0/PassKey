import { credentialResolvers } from './credential.ts'
import { userResolvers } from './user.ts'

const resolvers = {
  Mutation: {
    ...credentialResolvers.Mutation
  },
  Query: {
    ...userResolvers.Query
  },
  User: {
    ...userResolvers.User
  }
}

export { resolvers }