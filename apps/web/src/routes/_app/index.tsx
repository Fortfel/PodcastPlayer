import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { cn } from '@workspace/ui/lib/utils'

import { Player } from '@/routes/_app/-components/layout/player'
import { PodcastsList } from '@/routes/_app/-components/layout/podcasts-list'
import { Queque } from '@/routes/_app/-components/layout/queque'
import { Search } from '@/routes/_app/-components/layout/search'

export const Route = createFileRoute('/_app/')({
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const shadowClass = 'shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]'


  return (
    <div className="grid max-h-[calc(100dvh-var(--nav-height)-50px)] flex-1 grid-cols-1 grid-rows-[auto_400px_1fr] gap-5 gap-x-8 md:grid-cols-[minmax(0,1fr)_var(--container-2xs)] lg:grid-cols-[minmax(0,1fr)_var(--container-sm)]">
      <Search className="mb-5" />

      <PodcastsList className={cn(shadowClass, 'row-span-2 row-start-2 overflow-y-auto')} />
      <Player className={cn(shadowClass, 'hidden md:col-start-2 md:row-span-1 md:row-start-2 md:block')} />
      <Queque
        className={cn(shadowClass, 'hidden overflow-y-auto md:col-start-2 md:row-span-1 md:row-start-3 md:block')}
      >
        last one
      </Queque>
    </div>
  )
}
