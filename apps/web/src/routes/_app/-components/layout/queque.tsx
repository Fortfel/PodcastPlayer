import type * as React from 'react'
import { CirclePlayIcon, Trash2Icon } from 'lucide-react'

import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { cn } from '@workspace/ui/lib/utils'

const Queque = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="queque" className={cn('bg-muted rounded-lg', className)} {...props}>
      <ScrollArea className="h-full">
        <ItemGroup className="gap-4 p-4">
          <Item variant="outline" className="bg-card gap-4 rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-sm">Podcast Title Podcast Title Podcast Title</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-3">
              <CirclePlayIcon size={30} className="text-success" />
              <Trash2Icon size={30} className="text-destructive" />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card gap-4 rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-sm">Podcast Title Podcast Title Podcast Title</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-3">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Podcast Title Podcast Title Podcast Title Podcast Title Podcast Title Podcast</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-4">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Podcast Title Podcast Title Podcast Title Podcast Title Podcast Title Podcast</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-4">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Podcast Title Podcast Title Podcast Title Podcast Title Podcast Title Podcast</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-4">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Podcast Title Podcast Title Podcast Title Podcast Title Podcast Title Podcast</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-4">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
          <Item variant="outline" className="bg-card rounded-lg p-0 shadow-xl" role="listitem">
            <ItemMedia>
              <img src="/default-podcast.png" alt="default-podcast" className="max-w-25 aspect-square object-cover" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Podcast Title Podcast Title Podcast Title Podcast Title Podcast Title Podcast</ItemTitle>
            </ItemContent>
            <ItemContent className="gap-2 px-4">
              <CirclePlayIcon />
              <Trash2Icon />
            </ItemContent>
          </Item>
        </ItemGroup>
      </ScrollArea>
    </div>
  )
}

export { Queque }
