import * as React from 'react'
import { Store } from '@tanstack/react-store'

import type { RouterOutputs } from '@workspace/api/server'

import { loadPlayerFromStorage, loadQueueFromStorage, saveQueueToStorage } from '@/lib/podcast-player-storage'

export type Episode = RouterOutputs['podcastIndex']['searchEpisodeByItunesId']['items'][number]

export interface PodcastPlayerStoreState {
  isSubmitting: boolean

  view: 'podcast' | 'episode'
  selectedPodcast: RouterOutputs['podcastIndex']['searchPodcastByTerm']['feeds'][number] | null
  podcasts: RouterOutputs['podcastIndex']['searchPodcastByTerm'] | null
  selectedEpisode: Episode | null
  episodes: RouterOutputs['podcastIndex']['searchEpisodeByItunesId'] | null
  queue: Array<Episode>
  currentlyPlaying: Episode | null

  errorMessage: string | null
}

const PodcastPlayerStoreContext = React.createContext<Store<PodcastPlayerStoreState> | null>(null)

const PodcastPlayerStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(() => {
    const initialQueue = loadQueueFromStorage()
    const initialPlayer = loadPlayerFromStorage()

    const storeInstance = new Store<PodcastPlayerStoreState>({
      isSubmitting: false,
      view: 'podcast',
      selectedPodcast: null,
      podcasts: null,
      selectedEpisode: null,
      episodes: null,
      queue: initialQueue,
      currentlyPlaying: initialPlayer.episode,

      errorMessage: null,
    })

    let prevQueue = initialQueue // Created once, lives in closure

    storeInstance.subscribe(() => {
      const { queue } = storeInstance.state
      if (queue !== prevQueue) {
        prevQueue = queue // Updates the closure variable
        saveQueueToStorage(queue)
      }
    })

    return storeInstance
  })

  return <PodcastPlayerStoreContext.Provider value={store}>{children}</PodcastPlayerStoreContext.Provider>
}

export { PodcastPlayerStoreProvider, PodcastPlayerStoreContext }
