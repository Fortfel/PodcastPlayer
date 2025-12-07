import type * as React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { PodcastPlayerStoreProvider } from '@/providers/podcast-player-store-provider'
import { AppNavbar } from '@/routes/-components/layout/nav/app-navbar'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const navbarHeight = '64px'

  return (
    <div className="bg-background text-foreground overflow-x-hidden font-sans antialiased">
      <AppNavbar height={navbarHeight} />

      <main
        className={'mx-auto min-h-dvh max-w-7xl px-2 py-6 pt-[calc(var(--nav-height)+1.5rem)] sm:px-4'}
        style={{ '--nav-height': navbarHeight } as React.CSSProperties}
      >
        <PodcastPlayerStoreProvider>
          <Outlet />
        </PodcastPlayerStoreProvider>
      </main>
    </div>
  )
}
