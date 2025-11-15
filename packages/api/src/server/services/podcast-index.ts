import * as crypto from 'node:crypto'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const PodcastFeedSchema = z.object({
  id: z.int(),
  podcastGuid: z.string(),
  title: z.string(),
  url: z.url(),
  originalUrl: z.url(),
  link: z.url(),
  description: z.string(),
  author: z.string(),
  ownerName: z.string(),
  image: z.url(),
  artwork: z.url(),
  lastUpdateTime: z.int(),
  lastCrawlTime: z.int(),
  lastParseTime: z.int(),
  lastGoodHttpStatusTime: z.int(),
  lastHttpStatus: z.int(),
  contentType: z.string(),
  itunesId: z.int().nullable(),
  generator: z.string(),
  language: z.string(),
  explicit: z.boolean().optional(), // Optional - not present in iTunes ID response
  type: z.union([z.literal(0), z.literal(1)]),
  medium: z.string().optional(), // Optional - not present in iTunes ID response
  dead: z.int(),
  episodeCount: z.int(),
  crawlErrors: z.int(),
  parseErrors: z.int(),
  categories: z.record(z.string(), z.string()),
  locked: z.union([z.literal(0), z.literal(1)]),
  imageUrlHash: z.int().optional(), // Optional - only in iTunes ID response
  newestItemPubdate: z.int().optional(), // Optional - only in iTunes ID response
  funding: z
    .object({
      url: z.url(),
      message: z.string(),
    })
    .optional(), // Optional - only in iTunes ID response
})

const EpisodeSchema = z.object({
  id: z.int(),
  title: z.string(),
  link: z.url(),
  description: z.string(),
  guid: z.string(),
  datePublished: z.int(),
  datePublishedPretty: z.string(),
  dateCrawled: z.int(),
  enclosureUrl: z.url(),
  enclosureType: z.string(),
  enclosureLength: z.int(),
  duration: z.int().nullable(),
  explicit: z.union([z.literal(0), z.literal(1)]),
  episode: z.int().nullable(),
  episodeType: z.enum(['full', 'trailer', 'bonus']).nullable(),
  season: z.int().nullable(),
  image: z.url(),
  feedItunesId: z.int().nullable(),
  feedImage: z.url(),
  feedId: z.int(),
  feedLanguage: z.string(),
  feedDead: z.int(),
  feedDuplicateOf: z.int().nullable(),
  chaptersUrl: z.url().nullable(),
  transcriptUrl: z.url().nullable(),
  transcripts: z
    .array(
      z.object({
        url: z.url(),
        type: z.string(),
      }),
    )
    .optional(),
  soundbite: z
    .object({
      startTime: z.number(),
      duration: z.number(),
      title: z.string().optional(),
    })
    .optional(),
  soundbites: z
    .array(
      z.object({
        startTime: z.number(),
        duration: z.number(),
        title: z.string().optional(),
      }),
    )
    .optional(),
  persons: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        group: z.string().optional(),
        img: z.url().optional(),
        href: z.url().optional(),
      }),
    )
    .optional(),
  socialInteract: z
    .array(
      z.object({
        protocol: z.string(),
        uri: z.string(),
        accountId: z.string().optional(),
        accountUrl: z.url().optional(),
      }),
    )
    .optional(),
  value: z
    .object({
      type: z.string(),
      method: z.string(),
      suggested: z.number().optional(),
      recipients: z
        .array(
          z.object({
            name: z.string().optional(),
            type: z.string(),
            address: z.string(),
            split: z.number(),
            customKey: z.string().optional(),
            customValue: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
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
          `${apiEndpoint}/episodes/byitunesid?id=${id}${maxResults ? `&max=${maxResults.toString()}` : ''}`,
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
