import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { useResizeObserver } from '@workspace/ui/hooks/use-resize-observer'
import { cn } from '@workspace/ui/lib/utils'
import { PodcastsList } from '@/routes/_app/-components/layout/podcasts-list'
import { Search } from '@/routes/_app/-components/layout/search'

export const Route = createFileRoute('/_app/')({
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const shadowClass = 'shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]'
  const [searchRect, setSearchRect] = React.useState<DOMRectReadOnly | null>(null)
  const searchRef = React.useRef<HTMLDivElement>(null)

  useResizeObserver(searchRef, (entry) => {
    setSearchRect(entry.contentRect)
  })

  return (
    <div className="grid flex-1 grid-cols-1 grid-rows-[auto_400px_1fr] gap-5 md:grid-cols-[minmax(0,1fr)_var(--container-2xs)] lg:grid-cols-[minmax(0,1fr)_var(--container-sm)]">
      <Search ref={searchRef} className="mb-5" />

      <PodcastsList className={cn(shadowClass, 'row-span-2 row-start-2')} searchRect={searchRect} />
      <Player className={cn(shadowClass, 'hidden md:col-start-2 md:row-span-1 md:row-start-2 md:flex')} />
      <div className={cn(shadowClass, 'hidden md:col-start-2 md:row-span-1 md:row-start-3 md:flex')}>last one</div>
    </div>
  )
}
