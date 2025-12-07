import * as crypto from 'node:crypto'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const PodcastFeedSchema = z.object({
  id: z.int(),
  podcastGuid: z.string(),
  title: z.string(),
  url: z.url(),
  description: z.string(),
  author: z.string(),
  image: z.union([z.string(), z.url()]),
  newestItemPubdate: z.int(),
  itunesId: z.int().nullable(),
  language: z.string(),
  episodeCount: z.int(),
  categories: z.record(z.string(), z.string()).nullable(),
})

const EpisodeSchema = z.object({
  id: z.int(),
  title: z.string(),
  description: z.string(),
  guid: z.string(),
  datePublished: z.int(),
  enclosureUrl: z.url(),
  enclosureType: z.string(),
  duration: z.int().nullable(),
  episode: z.int().nullable(),
  season: z.int().nullable(),
  image: z.union([z.string(), z.url()]),
  feedId: z.int(),
  feedImage: z.url(),
})

// Response schemas
const SearchPodcastByTermResponseSchema = z.object({
  status: z.enum(['true', 'false']),
  feeds: z.array(PodcastFeedSchema),
  count: z.int(),
  query: z.string(),
  description: z.string(),
})

const SearchEpisodeByItunesIdResponseSchema = z.object({
  status: z.enum(['true', 'false']),
  items: z.array(EpisodeSchema),
  count: z.int(),
  query: z.string(),
  description: z.string(),
})

// Inferred types
type SearchPodcastByTermResponse = z.infer<typeof SearchPodcastByTermResponseSchema>
type SearchEpisodeByItunesIdResponse = z.infer<typeof SearchEpisodeByItunesIdResponseSchema>

const initPodcastIndexApi = ({
  authKey,
  secretKey,
  userAgent,
  apiEndpoint,
}: {
  authKey: string
  secretKey: string
  userAgent: string
  apiEndpoint: string
}) => {
  const generateAuthHeaders = () => {
    const apiHeaderTime = Math.floor(Date.now() / 1000).toString()

    const hash = crypto
      .createHash('sha1')
      .update(authKey + secretKey + apiHeaderTime)
      .digest('hex')

    return {
      'User-Agent': userAgent,
      'X-Auth-Key': authKey,
      'X-Auth-Date': apiHeaderTime,
      Authorization: hash,
    }
  }

  return {
    searchPodcastByTerm: async (query: string, maxResults?: number): Promise<SearchPodcastByTermResponse> => {
      try {
        const response = await fetch(
          `${apiEndpoint}/search/byterm?q=${encodeURIComponent(query)}${maxResults ? `&max=${maxResults.toString()}` : ''}`,
          {
            method: 'GET',
            headers: generateAuthHeaders(),
          },
        )

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Podcast Index API error: ${response.status.toString()} ${response.statusText}`,
          })
        }

        const data = SearchPodcastByTermResponseSchema.safeParse(await response.json())

        if (!data.success) {
          console.error('Podcast Index API returned invalid data:', data.error)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Podcast Index returned invalid data format',
            cause: data.error,
          })
        }

        return data.data
      } catch (error) {
        if (error instanceof TRPCError) throw error

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search podcasts',
          cause: error,
        })
      }
    },

    searchEpisodeByItunesId: async (id: string, maxResults?: number): Promise<SearchEpisodeByItunesIdResponse> => {
      try {
        const response = await fetch(
          `${apiEndpoint}/episodes/byitunesid?id=${encodeURIComponent(id)}${maxResults ? `&max=${maxResults.toString()}` : ''}`,
          {
            method: 'GET',
            headers: generateAuthHeaders(),
          },
        )

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Podcast Index API error: ${response.status.toString()} ${response.statusText}`,
          })
        }

        const data = SearchEpisodeByItunesIdResponseSchema.safeParse(await response.json())

        if (!data.success) {
          console.error('Podcast Index API returned invalid data:', data.error)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Podcast Index returned invalid data format',
            cause: data.error,
          })
        }

        return data.data
      } catch (error) {
        if (error instanceof TRPCError) throw error

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search episodes',
          cause: error,
        })
      }
    },
  }
}

export { initPodcastIndexApi }
export type PodcastIndexApiInstance = ReturnType<typeof initPodcastIndexApi>
