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
      addToQueue: (episode: PodcastPlayerStoreState['queue'][number]) =>
        store.setState((s) => {
          const isExisting = s.queue.some((e) => e.id === episode.id)
          if (isExisting) return s
          return { ...s, queue: [...s.queue, episode] }
        }),
      removeFromQueue: (episodeId: number) =>
        store.setState((s) => ({ ...s, queue: s.queue.filter((e) => e.id !== episodeId) })),
      clearQueue: () => store.setState((s) => ({ ...s, queue: [] })),
      playEpisode: (episode: PodcastPlayerStoreState['currentlyPlaying']) =>
        store.setState((s) => ({ ...s, currentlyPlaying: episode })),
      playFromQueue: (episodeId: number) =>
        store.setState((s) => {
          const episode = s.queue.find((e) => e.id === episodeId)
          if (!episode) return s
          return {
            ...s,
            currentlyPlaying: episode,
            queue: s.queue.filter((e) => e.id !== episodeId),
          }
        }),
      setErrorMessage: (errorMessage: PodcastPlayerStoreState['errorMessage']) =>
        store.setState((s) => ({ ...s, errorMessage })),
      clearErrorMessage: () => store.setState((s) => ({ ...s, errorMessage: null })),
    }),
    [store],
  )
}

export { usePodcastPlayerStore }
