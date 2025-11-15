import { createTRPCRouter } from '../trpc'
import { podcastIndexRouter } from './podcast-index'

export const appRouter = createTRPCRouter({
  podcastIndex: podcastIndexRouter,
})
