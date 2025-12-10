import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'
import { cn } from '@workspace/ui/lib/utils'

import { usePodcastPlayerStore } from '@/hooks/use-podcast-player-store'
import { Player } from '@/routes/_app/-components/layout/player'
import { PodcastsList } from '@/routes/_app/-components/layout/podcasts-list'
import { Queue } from '@/routes/_app/-components/layout/queue'
import { Search } from '@/routes/_app/-components/layout/search'

export const Route = createFileRoute('/_app/')({
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const { store } = usePodcastPlayerStore()
  const currentlyPlaying = useStore(store, (state) => state.currentlyPlaying)

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const shadowClass = 'shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]'

  return isDesktop ? (
    <div className="grid max-h-[max(800px,calc(100dvh-var(--nav-height)-50px))] grid-cols-[minmax(0,1fr)_var(--container-sm)] grid-rows-[auto_400px_1fr] gap-5 gap-x-8">
      <Search className="-mr-24 mb-5" />

      <PodcastsList className={cn(shadowClass, 'row-span-2 row-start-2')} />
      <Player className={cn(shadowClass, 'col-start-2 row-span-1 row-start-2')} />
      <Queue className={cn(shadowClass, 'col-start-2 row-span-1 row-start-3 overflow-y-auto')} />
    </div>
  ) : (
    <Tabs defaultValue={currentlyPlaying ? 'listen' : 'search'} className="grid grid-cols-1 grid-rows-[auto_1fr]">
      <TabsList className="[&>[data-slot=tabs-trigger][data-state=active]]:bg-success [&>[data-slot=tabs-trigger][data-state=active]]:text-success-foreground flex h-12 w-full justify-center border sm:mb-4">
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="listen">Listen</TabsTrigger>
      </TabsList>
      <TabsContent value="search" className="row-start-2 grid grid-rows-[auto_1fr]">
        <Search className="mb-5" />
        <PodcastsList className={cn(shadowClass, '')} />
      </TabsContent>
      <TabsContent value="listen" className="row-start-2 grid grid-rows-[auto_1fr] gap-8">
        <Player
          className={cn(
            shadowClass,
            '[&_img]:w-30 mt-2 [&>div>div:first-child]:flex-row [&>div>div:first-child]:gap-5 sm:[&>div>div:first-child]:flex-col sm:[&>div>div:first-child]:gap-1 [&_img]:mb-0 [&_img]:mt-0 sm:[&_img]:-mt-10 sm:[&_img]:mb-5',
          )}
        />
        <Queue className={cn(shadowClass, '')} />
      </TabsContent>
    </Tabs>
  )
}
