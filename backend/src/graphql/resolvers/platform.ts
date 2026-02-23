import type { ListPaginationParams } from '../../db/pagination.ts'
import { platforms } from '../../services/platform.ts'
import type { GraphQLContext } from '../context.ts'
import { logger } from '../../config/logger.ts'

const platformResolvers = {
  Platform: {
    fetch: async ( _: unknown, args: { query?: string | null, offset: number, limit: number }, context: GraphQLContext) => {
      try {
        const paginationParams: ListPaginationParams = {
          offset: args.offset,
          limit: args.limit
        }
        const result = args.query ?
          platforms.search(args.query, paginationParams) :
          platforms.fetch(paginationParams);
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
