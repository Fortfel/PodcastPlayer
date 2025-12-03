import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'
import { cn } from '@workspace/ui/lib/utils'

import { Player } from '@/routes/_app/-components/layout/player'
import { PodcastsList } from '@/routes/_app/-components/layout/podcasts-list'
import { Queque } from '@/routes/_app/-components/layout/queque'
import { Search } from '@/routes/_app/-components/layout/search'

export const Route = createFileRoute('/_app/')({
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const shadowClass = 'shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]'


  return isDesktop ? (
    <div className="grid max-h-[calc(100dvh-var(--nav-height)-50px)] grid-cols-[minmax(0,1fr)_var(--container-sm)] grid-rows-[auto_400px_1fr] gap-5 gap-x-8">
      <Search className="mb-5" />

      <PodcastsList className={cn(shadowClass, 'row-span-2 row-start-2')} />
      <Player className={cn(shadowClass, 'col-start-2 row-span-1 row-start-2')} />
      <Queque className={cn(shadowClass, 'col-start-2 row-span-1 row-start-3 overflow-y-auto')} />
    </div>
  ) : (
    <Tabs
      defaultValue="search"
      className="grid max-h-[calc(100dvh-var(--nav-height)-50px)] grid-cols-1 grid-rows-[auto_1fr]"
    >
      <TabsList className="[&>[data-slot=tabs-trigger][data-state=active]]:bg-success [&>[data-slot=tabs-trigger][data-state=active]]:text-success-foreground mb-4 flex h-12 w-full justify-center border">
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="listen">Listen</TabsTrigger>
      </TabsList>
      <TabsContent value="search" className="-m-6.5 p-6.5 row-start-2 grid grid-rows-[auto_1fr] overflow-hidden">
        <Search className="mb-5" />
        <PodcastsList className={cn(shadowClass, 'overflow-y-auto')} />
      </TabsContent>
      <TabsContent value="listen" className="-m-6.5 p-6.5 row-start-2 grid grid-rows-[auto_1fr] gap-8 overflow-hidden">
        <Player className={cn(shadowClass, 'mt-2 [&_img]:-mt-10 [&_img]:mb-5')} />
        <Queque className={cn(shadowClass, 'overflow-y-auto')} />
      </TabsContent>
    </Tabs>
  )
}
