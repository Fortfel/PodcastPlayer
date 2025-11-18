import type {
  AppRouter,
  CreateFastifyContextOptions,
  FastifyTRPCPluginOptions,
  PodcastIndexApiInstance,
} from '@workspace/api/server'
import { appRouter, createTRPCContext } from '@workspace/api/server'

import { env } from '#/env'

export const getFastifyTRPCPluginOptions = (
  podcastIndexApi: PodcastIndexApiInstance,
): FastifyTRPCPluginOptions<AppRouter> => ({
  prefix: env.SERVER_API_PATH,
  trpcOptions: {
    router: appRouter,
    createContext: ({ req, res, info }: CreateFastifyContextOptions) => {
      return createTRPCContext({
        req,
        res,
        info,
        podcastApi: podcastIndexApi,
      })
    },
    onError({ path, error, type }) {
      const isProduction = env.NODE_ENV === 'production'

      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error(`[TRPC Error] ${type} on ${path as string}:`, error)
      } else if (!isProduction) {
        // Log all errors in development
        console.log(`[TRPC] ${error.code} on ${path as string}: ${error.message}`)
      }
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
})
