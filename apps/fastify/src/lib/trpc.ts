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
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
})
