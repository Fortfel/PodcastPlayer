import type * as React from 'react'
import { useStore } from '@tanstack/react-store'
import { CirclePlayIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { cn } from '@workspace/ui/lib/utils'

import { usePodcastPlayerStore } from '@/hooks/use-podcast-player-store'

const Queue = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { store, removeFromQueue, playFromQueue, clearQueue } = usePodcastPlayerStore()
  const queue = useStore(store, (state) => state.queue)

  return (
    <div data-slot="queue" className={cn('bg-muted rounded-lg', className)} {...props}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground font-semibold">Queue ({queue.length})</h3>
            {queue.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearQueue}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>

          {queue.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Queue is empty. Add episodes to play.</p>
          ) : (
            <ItemGroup className="gap-3">
              {queue.map((episode) => (
                <Item
                  key={episode.id}
                  variant="outline"
                  className="bg-card gap-3 rounded-lg p-0 shadow-md"
                  role="listitem"
                >
                  <ItemMedia>
                    <img
                      src={episode.image || episode.feedImage || `${import.meta.env.BASE_URL}default-podcast.png`}
                      alt={episode.title}
                      className="aspect-square max-w-20 rounded-l-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `${import.meta.env.BASE_URL}default-podcast.png`
                      }}
                    />
                  </ItemMedia>
                  <ItemContent className="min-w-0 flex-1 py-2">
                    <ItemTitle className="text-sm">{episode.title}</ItemTitle>
                    <p className="text-muted-foreground text-xs">
                      {episode.duration ? `${Math.floor(episode.duration / 60).toString()} min` : 'Duration unknown'}
                    </p>
                  </ItemContent>
                  <ItemContent className="gap-1 px-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => playFromQueue(episode.id)}
                          className="hover:text-success focus:text-success cursor-pointer p-1 transition-colors"
                          aria-label="Play episode"
                        >
                          <CirclePlayIcon size={30} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Play now</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => removeFromQueue(episode.id)}
                          className="hover:text-destructive focus:text-destructive cursor-pointer p-1 transition-colors"
                          aria-label="Remove from queue"
                        >
                          <Trash2Icon size={30} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Remove from queue</TooltipContent>
                    </Tooltip>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export { Queue }
