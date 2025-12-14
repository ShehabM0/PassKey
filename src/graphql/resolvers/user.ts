import { getUserById } from '../../services/user.ts'
import type { GraphQLContext } from '../context.ts'
import { logger } from '../../config/logger.ts'

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

    user: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      if (!context.uid) {
        throw new Error('Authentication required!')
      }

      const uid = Number(args.id)
      if (context.uid !== uid)
        throw new Error('Forbidden. You can only access your own resources!')

      try {
        const user = await getUserById(uid)

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
  },
}

export { userResolvers }