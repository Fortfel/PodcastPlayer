import type * as React from 'react'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from '@tabler/icons-react'

import { Progress } from '@workspace/ui/components/progress'
import { cn } from '@workspace/ui/lib/utils'

const Player = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="player" className={cn('bg-muted rounded-lg ', className)} {...props}>
      <div className="flex flex-col items-center gap-2 p-4">
        <img
          src="/default-podcast.png"
          alt="default-podcast"
          className="w-50 -mt-20 mb-10 rounded-full object-cover shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]"
        />
        <h2 className="text-2xl font-semibold">Podcast Title</h2>
        <p>Date Published</p>
        <div className="mt-auto flex w-full flex-col items-center">
          <div className="flex w-full justify-between px-2">
            <p>00:00</p>
            <p>00:00</p>
          </div>
          <Progress value={50} className="mb-4 w-[96%]" />
          <div className="[&>svg]:text-foreground/80 [&>svg:hover]:text-foreground mb-4 flex items-center gap-5 [&>svg]:cursor-pointer">
            <IconPlayerTrackPrevFilled size="34" />
            <IconPlayerPlayFilled size="40" />
            <IconPlayerPauseFilled size="40" />
            <IconPlayerTrackNextFilled size="34" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Player }
