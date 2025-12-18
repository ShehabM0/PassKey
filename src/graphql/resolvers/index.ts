import { credentialResolvers } from './credential.ts'
import { platformResolvers } from './platform.ts'
import { userResolvers } from './user.ts'

const resolvers = {
  Mutation: {
    ...credentialResolvers.Mutation
  },
  Query: {
    ...userResolvers.Query,
    platform: () => ({})
  },
  Platform: {
    ...platformResolvers.Platform
  },
  User: {
    ...userResolvers.User
  }
}

export { resolvers }