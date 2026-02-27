import { getCredential, getRelatedCredentials, getUserCredentials } from '../../services/credential.ts'
import { getUserById } from '../../services/user.ts'
import type { GraphQLContext } from '../context.ts'
import { logger } from '../../config/logger.ts'
import { decrypt } from '../../utils/encrypt.ts'

type UserParent = {
  id: string
}

const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.uid)
        throw new Error('Authentication required!')

      try {
        const user = await getUserById(context.uid)

        return {
          id: String(user.id),
          name: user.name!,
          email: user.email,
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching user!'
        logger.error(message)
        throw new Error(message)
      }
    },
    relatedCredentials: async (_: unknown, args: { id: number, page?: number, limit?: number }, context: GraphQLContext) => {
      const uid = context.uid;
      if (!uid)
        throw new Error('Authentication required!')

      try {
        const userCredentials = await getRelatedCredentials(uid, args.id, { page: args.page, limit: args.limit })
        
        const credentials = userCredentials.data
        const pagination = userCredentials.pagination
        const data = credentials.map((credential) => ({
          ...credential,
          created_at: credential.created_at?.toISOString(), // Date -> string
          updated_at: credential.updated_at?.toISOString(),
        }))

        return { data, pagination }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching credentials!'
        logger.error('Error getting related credentials!', e)
        throw new Error(message)
      }
    },
    revealCredentialPassword: async (_: unknown, args: { id: number }, context: GraphQLContext) => {
      if (!context.uid)
        throw new Error('Authentication required!')

      try {
        const credential = await getCredential(args.id)
        if(!credential)
          throw new Error("Credential doesn't exist!")

        const password = credential.password
        return decrypt(password)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching credential password!'
        logger.error('Error fetching credential password!', e)
        throw new Error(message)
      }

    }
  },
  User: {
    credentials: async (parent: UserParent, args: { page?: number, limit?: number }, context: GraphQLContext) => {
      if (!context.uid)
        throw new Error('Authentication required!')

      try {
        const uid = Number(parent.id)
        const userCredentials = await getUserCredentials(uid, { page: args.page, limit: args.limit })
        
        const credentials = userCredentials.data
        const pagination = userCredentials.pagination
        const data = credentials.map((credential) => ({
          ...credential,
          created_at: credential.created_at?.toISOString(), // Date -> string
          updated_at: credential.updated_at?.toISOString(),
        }))

        return { data, pagination }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching credentials!'
        logger.error('Error getting user credentials!', e)
        throw new Error(message)
      }
    }
  }
}

export { userResolvers }