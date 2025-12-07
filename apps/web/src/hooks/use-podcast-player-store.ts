import type { PodcastPlayerStoreState } from '@/providers/podcast-player-store-provider'
import * as React from 'react'

import { PodcastPlayerStoreContext } from '@/providers/podcast-player-store-provider'

const usePodcastPlayerStore = () => {
  const store = React.useContext(PodcastPlayerStoreContext)
  if (!store) {
    throw new Error('usePodcastPlayerStore must be used within a PodcastPlayerStoreProvider')
  }
  return React.useMemo(
    () => ({
      store,
      setIsSubmitting: (isSubmitting: PodcastPlayerStoreState['isSubmitting']) =>
        store.setState((s) => ({ ...s, isSubmitting })),
      setActiveView: (view: PodcastPlayerStoreState['view']) => store.setState((s) => ({ ...s, view })),
      setSelectedPodcast: (selectedPodcast: PodcastPlayerStoreState['selectedPodcast']) =>
        store.setState((s) => ({ ...s, selectedPodcast })),
      setPodcasts: (podcasts: PodcastPlayerStoreState['podcasts']) => store.setState((s) => ({ ...s, podcasts })),
      setSelectedEpisode: (selectedEpisode: PodcastPlayerStoreState['selectedEpisode']) =>
        store.setState((s) => ({ ...s, selectedEpisode })),
      setEpisodes: (episodes: PodcastPlayerStoreState['episodes']) => store.setState((s) => ({ ...s, episodes })),
      setQueue: (queue: PodcastPlayerStoreState['queue']) => store.setState((s) => ({ ...s, queue })),
      setCurrentlyPlaying: (currentlyPlaying: PodcastPlayerStoreState['currentlyPlaying']) =>
        store.setState((s) => ({ ...s, currentlyPlaying })),
      setErrorMessage: (errorMessage: PodcastPlayerStoreState['errorMessage']) =>
        store.setState((s) => ({ ...s, errorMessage })),
      clearErrorMessage: () => store.setState((s) => ({ ...s, errorMessage: null })),
    }),
    [store],
  )
}

export { usePodcastPlayerStore }
