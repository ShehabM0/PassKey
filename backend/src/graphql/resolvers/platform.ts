import type { ListPaginationParams } from '../../db/pagination.ts'
import { platforms } from '../../services/platform.ts'
import type { GraphQLContext } from '../context.ts'
import { logger } from '../../config/logger.ts'

const platformResolvers = {
  Platform: {
    filter: async ( _: unknown, args: { query: string }, context: GraphQLContext) => {
      try {
        const data = platforms.search(args.query)
        return data
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error filtering platforms!'
        logger.error(message)
        throw new Error(message)
      }
    },
    fetch: async ( _: unknown, args: { offset?: number, limit?: number }, context: GraphQLContext) => {
      try {
        const paginationParams: ListPaginationParams = {
          offset: args.offset,
          limit: args.limit
        }
        const result = platforms.fetch(paginationParams)
        const pagination = result.pagination
        const data = result.data

        return { data, pagination }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Error fetching platforms!'
        logger.error(message)
        throw new Error(message)
      }
    }
  }
}

export { platformResolvers }
