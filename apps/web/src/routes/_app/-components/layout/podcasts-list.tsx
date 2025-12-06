import type * as React from 'react'

import type { RouterOutputs } from '@workspace/api/server'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { CircleSpinner } from '@workspace/ui/components/spinner'
import { cn } from '@workspace/ui/lib/utils'

type PodcastsListProps = React.ComponentProps<'div'> & {
  podcasts: RouterOutputs['podcastIndex']['searchPodcastByTerm'] | null
  isLoading?: boolean
}

const PodcastsList = ({ podcasts, isLoading = false, className, ...props }: PodcastsListProps) => {
  return (
    <div data-slot="podcasts-list" className={cn('bg-muted @container rounded-lg', className)} {...props}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          {isLoading ? (
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
                    <CircleSpinner className="text-foreground/25 mx-auto size-10" />
                  </div>
                </Skeleton>
              ))}
            </>
          ) : podcasts?.status === 'true' ? (
            podcasts.feeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg border shadow-xl"
              >
                <img
                  src={feed.image || '/default-podcast.png'}
                  alt={feed.title}
                  className="shrink-1 @max-md:max-w-52 aspect-square size-full min-w-32 max-w-60 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/default-podcast.png'
                  }}
                />
                <ScrollArea className="@max-md:flex-col @max-md:min-w-0 flex min-w-64 flex-1 p-4">
                  <div className="text-muted-foreground flex h-52 flex-col gap-2">
                    <h2 className="@max-md:text-center text-foreground text-xl font-semibold">{feed.title}</h2>
                    <p className="text-sm/4.5 text-justify">{feed.description}</p>
                    <p>
                      <strong>Episodes:</strong> {feed.episodeCount}
                    </p>
                    <p className="text-sm">
                      <strong>Newest Episode:</strong> {new Date(feed.lastUpdateTime * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </ScrollArea>
              </div>
            ))
          ) : (
            'No podcasts found'
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export { PodcastsList }
