import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useVirtualizer } from '@tanstack/react-virtual'
import htmlReactParser from 'html-react-parser'
import { CirclePlayIcon, ListIcon } from 'lucide-react'

import type { RouterOutputs } from '@workspace/api/server'
import { useTRPC } from '@workspace/api/client'
import { Button } from '@workspace/ui/components/button'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { CircleSpinner } from '@workspace/ui/components/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { cn } from '@workspace/ui/lib/utils'

import { usePodcastPlayerStore } from '@/hooks/use-podcast-player-store'

type PodcastFeed = RouterOutputs['podcastIndex']['searchPodcastByTerm']['feeds'][number]
type Episode = RouterOutputs['podcastIndex']['searchEpisodeByItunesId']['items'][number]

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton
        key={i}
        className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg border shadow-xl"
      >
        <div className="bg-muted shrink-1 @max-md:max-w-52 aspect-square size-full min-w-32 max-w-60" />
        <div className="flex min-w-64 flex-1 flex-col gap-3 p-4">
          <div className="bg-muted h-6 w-3/4 rounded" />
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-1/2 rounded" />
          <CircleSpinner className="text-foreground/25 size-10" />
        </div>
      </Skeleton>
    ))}
  </>
)

const PodcastCard = ({ feed, onSelect }: { feed: PodcastFeed; onSelect?: (feed: PodcastFeed) => void }) => (
  <button
    type="button"
    onClick={() => onSelect?.(feed)}
    className="bg-card @max-md:flex-col @max-md:items-center hover:ring-primary/50 mb-4 flex w-full cursor-pointer items-start gap-2 rounded-lg border text-left shadow-xl transition-all hover:ring-2"
  >
    <img
      src={feed.image || '/default-podcast.png'}
      alt={feed.title}
      className="shrink-1 @max-md:max-w-52 aspect-square size-full min-w-32 max-w-60 rounded-l-lg object-cover"
      onError={(e) => {
        e.currentTarget.src = '/default-podcast.png'
      }}
    />
    <ScrollArea className="@max-md:flex-col @max-md:min-w-0 flex min-w-64 flex-1 p-4">
      <div className="text-muted-foreground flex h-52 flex-col gap-2">
        <h2 className="@max-md:text-center text-foreground text-xl font-semibold">{feed.title}</h2>
        <p className="text-sm/4.5 break-all text-justify">{feed.description}</p>
        <p>
          <strong>Episodes:</strong> {feed.episodeCount}
        </p>
        <p className="text-xs">
          <strong>Newest Episode:</strong>{' '}
          {feed.newestItemPubdate ? new Date(feed.newestItemPubdate * 1000).toLocaleDateString() : 'Not Available'}
        </p>
      </div>
    </ScrollArea>
  </button>
)

type EpisodeCardProps = {
  episode: Episode
  onPlay?: (episode: Episode) => void
  onAddToQueue?: (episode: Episode) => void
}

const EpisodeCard = ({ episode, onPlay, onAddToQueue }: EpisodeCardProps) => (
  <div className="bg-card @max-md:flex-col @max-md:items-center hover:ring-primary/50 mb-4 flex w-full items-start gap-2 rounded-lg border text-left shadow-xl">
    <img
      src={episode.image || episode.feedImage || '/default-podcast.png'}
      alt={episode.title}
      className="shrink-1 @max-md:max-w-52 aspect-square size-full min-w-32 max-w-60 rounded-l-lg object-cover"
      onError={(e) => {
        e.currentTarget.src = '/default-podcast.png'
      }}
    />
    <ScrollArea className="@max-md:flex-col @max-md:min-w-0 flex min-w-64 flex-1 p-4">
      <div className="text-muted-foreground flex h-52 flex-col gap-2">
        <h2 className="@max-md:text-center text-foreground text-xl font-semibold">{episode.title}</h2>
        <div className="@max-md:justify-center flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onPlay?.(episode)}
                className="hover:text-success focus:text-success cursor-pointer transition-colors"
                aria-label="Play episode"
              >
                <CirclePlayIcon size={36} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Play Episode</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onAddToQueue?.(episode)}
                className="hover:text-primary focus:text-primary cursor-pointer transition-colors"
                aria-label="Add to queue"
              >
                <ListIcon size={36} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add to queue</TooltipContent>
          </Tooltip>
          <div>
            <p className="text-xs">Published: {new Date(episode.datePublished * 1000).toLocaleDateString()}</p>
            <p className="text-xs">Duration: {Math.floor((episode.duration ?? 0) / 60)} min</p>
          </div>
        </div>

        <p className="text-sm/4.5 break-all text-justify">{htmlReactParser(episode.description)}</p>
      </div>
    </ScrollArea>
  </div>
)

const PodcastsList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const {
    store,
    setIsSubmitting,
    setErrorMessage,
    clearErrorMessage,
    setActiveView,
    setSelectedPodcast,
    setEpisodes,
    addToQueue,
    playEpisode,
  } = usePodcastPlayerStore()
  const currentView = useStore(store, (state) => state.view)
  const isLoading = useStore(store, (state) => state.isSubmitting)
  const errorMessage = useStore(store, (state) => state.errorMessage)
  const selectedPodcast = useStore(store, (state) => state.selectedPodcast)
  const podcasts = useStore(store, (state) => state.podcasts)
  const episodes = useStore(store, (state) => state.episodes)

  // Determine which list to virtualize
  const items = currentView === 'podcast' ? (podcasts?.feeds ?? []) : (episodes?.items ?? [])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => {
      // ScrollArea creates a [data-radix-scroll-area-viewport] element that's the actual scrollable container
      return scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
    },
    estimateSize: () => 258, // Estimated height of each card (adjust based on your card height)
    overscan: 5, // Render 5 extra items above and below viewport for smoother scrolling
  })

  const virtualItems = virtualizer.getVirtualItems()

  React.useEffect(() => {
    virtualizer.scrollToIndex(0, { align: 'start' })
  }, [currentView, episodes, podcasts, virtualizer])

  const handlePodcastClick = async (feed: PodcastFeed) => {
    if (!feed.itunesId) return

    setActiveView('episode')
    setSelectedPodcast(feed)

    setIsSubmitting(true)
    clearErrorMessage()

    try {
      const result = await queryClient.fetchQuery(
        trpc.podcastIndex.searchEpisodeByItunesId.queryOptions({ id: feed.itunesId.toString(), maxResults: 1000 }),
      )
      setEpisodes(result)
    } catch (error) {
      console.error('Failed to fetch episodes', error)
      setErrorMessage('Failed to fetch episodes')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div data-slot="podcasts-list" className={cn('bg-muted @container rounded-lg', className)} {...props}>
      {isLoading ? (
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <LoadingSkeleton />
        </div>
      ) : errorMessage ? (
        <div className="p-4 text-center text-xl">{errorMessage}</div>
      ) : currentView === 'podcast' && podcasts?.status === 'true' && podcasts.feeds.length > 0 ? (
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div
            className="relative my-1 w-full"
            style={{
              height: `${virtualizer.getTotalSize().toString()}px`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const feed = podcasts.feeds[virtualRow.index] as PodcastFeed
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute left-0 top-0 w-full px-4 sm:px-6"
                  style={{
                    height: `${virtualRow.size.toString()}px`,
                    transform: `translateY(${virtualRow.start.toString()}px)`,
                  }}
                >
                  <PodcastCard feed={feed} onSelect={(feed) => void handlePodcastClick(feed)} />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      ) : currentView === 'episode' && episodes?.status === 'true' && episodes.items.length > 0 ? (
        <div className="flex h-full flex-col">
          <div className="bg-muted flex shrink-0 items-center gap-3 border-b p-4 sm:p-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveView('podcast')
              }}
            >
              ← Back
            </Button>
            <h2 className="text-foreground text-lg font-semibold">{selectedPodcast?.title}</h2>
          </div>
          <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1">
            <div
              className="relative w-full"
              style={{
                height: `${virtualizer.getTotalSize().toString()}px`,
              }}
            >
              {virtualItems.map((virtualRow) => {
                const episode = episodes.items[virtualRow.index] as Episode
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className="absolute left-0 top-0 w-full px-4 sm:px-6"
                    style={{
                      height: `${virtualRow.size.toString()}px`,
                      transform: `translateY(${virtualRow.start.toString()}px)`,
                    }}
                  >
                    <EpisodeCard episode={episode} onPlay={playEpisode} onAddToQueue={addToQueue} />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="p-4 text-center text-xl">No {currentView}s found</div>
      )}
    </div>
  )
}

export { PodcastsList }
