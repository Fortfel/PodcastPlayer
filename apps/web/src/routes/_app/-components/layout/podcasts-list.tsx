import type * as React from 'react'

import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { cn } from '@workspace/ui/lib/utils'

const PodcastsList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="podcasts-list" className={cn('bg-muted @container rounded-lg', className)} {...props}>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          pulsing podcast icon here
          <div className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg border shadow-xl">
            <img
              src="/default-podcast.png"
              alt="default-podcast"
              className="shrink-1 @max-md:max-w-52 aspect-square size-full min-w-32 max-w-60 object-cover"
            />
            <ScrollArea className="@max-md:flex-col @max-md:min-w-0 flex min-w-64 flex-1 p-4">
              <div className="text-muted-foreground flex h-52 flex-col gap-2">
                <h2 className="@max-md:text-center text-foreground text-xl font-semibold">Title</h2>
                <p className="text-sm/4.5 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus delectus dignissimos doloremque
                  eos error maiores minima minus, molestiae nam natus nisi nobis numquam odio quibusdam recusandae
                  repudiandae saepe, vel voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
                  atque dignissimos ducimus earum enim labore quo voluptatibus. Accusamus beatae consectetur eligendi
                  expedita iusto quae unde. Libero minus neque possimus ullam! Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Amet aspernatur blanditiis consectetur dicta fuga harum impedit in itaque iusto
                  minima molestias, odio officia, pariatur qui, repellendus sequi sit vel vero.
                </p>
                <p>
                  <strong>Episodes:</strong> 50
                </p>
                <p className="text-sm">Newest Episode: 2025-11-28</p>
              </div>
            </ScrollArea>
          </div>
          <div className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg shadow-xl">
            <img
              src="/default-podcast.png"
              alt="default-podcast"
              className="shrink-1 size-full min-w-32 max-w-60 object-cover"
            />
            <div className="@max-md:flex-none @max-md:min-w-0 flex h-60 min-w-64 flex-1 flex-col gap-2 overflow-y-auto p-4">
              <h2 className="@max-md:text-center text-xl font-semibold">Title</h2>
              <p className="text-sm/4.5 text-muted-foreground text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus delectus dignissimos doloremque eos
                error maiores minima minus, molestiae nam natus nisi nobis numquam odio quibusdam recusandae repudiandae
              </p>
              <p>
                <strong>Episodes:</strong> 50
              </p>
              <p className="text-sm">Newest Episode: 2025-11-28</p>
            </div>
          </div>
          <div className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg shadow-xl">
            <img
              src="/default-podcast.png"
              alt="default-podcast"
              className="shrink-1 size-full min-w-32 max-w-60 object-cover"
            />
            <div className="@max-md:flex-none @max-md:min-w-0 flex h-60 min-w-64 flex-1 flex-col gap-2 overflow-y-auto p-4">
              <h2 className="@max-md:text-center text-xl font-semibold">Title</h2>
              <p className="text-sm/4.5 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus delectus dignissimos doloremque eos
                error maiores minima minus, molestiae nam natus nisi nobis numquam odio quibusdam recusandae repudiandae
                saepe, vel voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet atque
              </p>
              <p>
                <strong>Episodes:</strong> 50
              </p>
              <p className="text-sm">Newest Episode: 2025-11-28</p>
            </div>
          </div>
          <div className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg shadow-xl">
            <img
              src="/default-podcast.png"
              alt="default-podcast"
              className="shrink-1 size-full min-w-32 max-w-60 object-cover"
            />
            <div className="@max-md:flex-none @max-md:min-w-0 flex h-60 min-w-64 flex-1 flex-col gap-2 overflow-y-auto p-4">
              <h2 className="@max-md:text-center text-xl font-semibold">Title</h2>
              <p className="text-sm/4.5 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus delectus dignissimos doloremque eos
                error maiores minima minus, molestiae nam natus nisi nobis numquam odio quibusdam recusandae repudiandae
                saepe, vel voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet atque
              </p>
              <p>
                <strong>Episodes:</strong> 50
              </p>
              <p>
                <strong>Newest Episode:</strong> 2025-11-28
              </p>
            </div>
          </div>
          <div className="bg-card @max-md:flex-col @max-md:items-center flex items-start gap-2 rounded-lg shadow-xl">
            <img
              src="/default-podcast.png"
              alt="default-podcast"
              className="shrink-1 size-full min-w-32 max-w-60 object-cover"
            />
            <div className="@max-md:flex-none @max-md:min-w-0 flex h-60 min-w-64 flex-1 flex-col gap-2 overflow-y-auto p-4">
              <h2 className="@max-md:text-center text-xl font-semibold">Title</h2>
              <p className="text-sm/4.5 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus delectus dignissimos doloremque eos
                error maiores minima minus, molestiae nam natus nisi nobis numquam odio quibusdam recusandae repudiandae
                saepe, vel voluptatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet atque
              </p>
              <p>
                <strong>Episodes:</strong> 50
              </p>
              <p>
                <strong>Newest Episode:</strong> 2025-11-28
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export { PodcastsList }
