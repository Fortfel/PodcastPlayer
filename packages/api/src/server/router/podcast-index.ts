import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import { publicProcedure } from '../trpc'

export const podcastIndexRouter = {
  searchPodcastByTerm: publicProcedure
    .input(z.object({ term: z.string().min(1, 'Search term is required').max(100), maxResults: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      return await ctx.podcastApi.searchPodcastByTerm(input.term, input.maxResults)
    }),
  searchEpisodeByItunesId: publicProcedure
    .input(z.object({ id: z.string().min(1, 'Search id is required').max(100), maxResults: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      return await ctx.podcastApi.searchEpisodeByItunesId(input.id, input.maxResults)
    }),
} satisfies TRPCRouterRecord
