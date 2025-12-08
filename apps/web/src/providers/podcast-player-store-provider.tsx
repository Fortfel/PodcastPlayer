import * as React from 'react'
import { Store } from '@tanstack/react-store'

import type { RouterOutputs } from '@workspace/api/server'

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

const QUEUE_STORAGE_KEY = 'podcastplayer-queue'

const loadQueueFromStorage = (): Array<Episode> => {
  try {
    const saved = localStorage.getItem(QUEUE_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Array<Episode>) : []
  } catch (error) {
    console.error('Failed to load queue from localStorage:', error)
    return []
  }
}

const saveQueueToStorage = (queue: Array<Episode>) => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error('Failed to save queue to localStorage:', error)
  }
}

const PodcastPlayerStoreContext = React.createContext<Store<PodcastPlayerStoreState> | null>(null)

const PodcastPlayerStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(() => {
    const initialQueue = loadQueueFromStorage()

    const storeInstance = new Store<PodcastPlayerStoreState>({
      isSubmitting: false,
      view: 'podcast',
      selectedPodcast: null,
      podcasts: null,
      selectedEpisode: null,
      episodes: null,
      queue: initialQueue,
      currentlyPlaying: null,

      errorMessage: null,
    })

    storeInstance.subscribe(() => {
      const { queue } = storeInstance.state
      saveQueueToStorage(queue)
    })

    return storeInstance
  })

  return <PodcastPlayerStoreContext.Provider value={store}>{children}</PodcastPlayerStoreContext.Provider>
}

export { PodcastPlayerStoreProvider, PodcastPlayerStoreContext }
