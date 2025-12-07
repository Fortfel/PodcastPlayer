import * as React from 'react'
import { Store } from '@tanstack/react-store'

import type { RouterOutputs } from '@workspace/api/server'

export interface PodcastPlayerStoreState {
  isSubmitting: boolean

  view: 'podcast' | 'episode'
  selectedPodcast: RouterOutputs['podcastIndex']['searchPodcastByTerm']['feeds'][number] | null
  podcasts: RouterOutputs['podcastIndex']['searchPodcastByTerm'] | null
  selectedEpisode: RouterOutputs['podcastIndex']['searchEpisodeByItunesId']['items'][number] | null
  episodes: RouterOutputs['podcastIndex']['searchEpisodeByItunesId'] | null
  queue: Array<RouterOutputs['podcastIndex']['searchEpisodeByItunesId']['items'][number]>
  currentlyPlaying: RouterOutputs['podcastIndex']['searchEpisodeByItunesId']['items'][number] | null

  errorMessage: string | null
}

const PodcastPlayerStoreContext = React.createContext<Store<PodcastPlayerStoreState> | null>(null)

const PodcastPlayerStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(
    () =>
      new Store<PodcastPlayerStoreState>({
        isSubmitting: false,
        view: 'podcast',
        selectedPodcast: null,
        podcasts: null,
        selectedEpisode: null,
        episodes: null,
        queue: [],
        currentlyPlaying: null,

        errorMessage: null,
      }),
  )

  return <PodcastPlayerStoreContext.Provider value={store}>{children}</PodcastPlayerStoreContext.Provider>
}

export { PodcastPlayerStoreProvider, PodcastPlayerStoreContext }
